module.exports = function createItemUrl (url, user, callback) {

    var models          = require('../../models');
    var itemTypes       = require('../../models/item/itemTypes.json');
    var request         = require('request'); 
    const cheerio       = require('cheerio')
    
    var host = getHost(url);
    var options = {
        headers: {'user-agent': 'node.js'}
    }
    request(url,options, function (error, response, html) {
        if (error)
            return callback(error);

        var $ = cheerio.load(html);
        
        var itemUrl = new models.ItemUrl();

        img = $('meta[property="og:image"]').attr("content");
        if(img == '' || img == null || img == undefined){
            img = $('img').first().attr("src");
        }

        if(img != null && img != '' && img != undefined){
            if(!(img.substring(0, 7) == 'http://' || img.substring(0, 8) == 'https://')){
                if(img[0] == '/' && img[1] == '/')
                    img = 'http:' + img;
                else if(img[0] == '/')
                    img = 'http://'+host + img;
                else
                    img = 'http://' + host + '/' + img;
            }
            itemUrl.image = img;
        }

        itemUrl.title = $('meta[property="og:title"]').attr("content");
        if(itemUrl.title == '' || itemUrl.title == null || itemUrl.title == undefined)
            itemUrl.title = $('title').html();

        itemUrl.description = $('meta[property="og:description"]').attr("content");
        if(itemUrl.description == '' || itemUrl.description == null || itemUrl.description == undefined)
            itemUrl.description = $('meta[name="description"]').attr("content");

        itemUrl.author = $('meta[name="author"]').attr("content");
        if(itemUrl.author == '' || itemUrl.author == null || itemUrl.author == undefined)
            itemUrl.author = $('meta[property="article:author"]').attr("content");

        itemUrl.type = $('meta[property="og:type"]').attr("content");
        itemUrl.site_name = $('meta[property="og:site_name"]').attr("content");

        itemUrl.host = host;
        itemUrl.url = url;
        itemUrl._user = user._id;
        itemUrl.save(function(err){
            if(err)callback(err)
            callback(null, itemTypes.URL, itemUrl)
        })
    });

    function getHost(url){
        var noHttpUrl = removeHttp(url);
        if(noHttpUrl)
            return noHttpUrl.split('/')[0]
        else
            return 'null';
    }

    function removeHttp(url){
        if(url.substring(0, 7) === 'http://'){
            url = url.substr(7);
        }else if(url.substring(0, 8) === 'https://'){
            url = url.substr(8);
        }
        return url;
    }


}
