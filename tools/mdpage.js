var TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')
var gfm = turndownPluginGfm.gfm
const request = require('request')
const util = require('util')
const getPromise = util.promisify(request.get)
const exec = require('child_process').exec
const fs = require('fs')
const cheerio = require('cheerio')

const argvlist = process.argv.slice(2)

const fileTitle = argvlist[1]
const cmd = 'hexo new "'+fileTitle+'"'
const url = argvlist[0]

async function httpget(url,file){
    const html =  await getPromise(url)
    const $ = cheerio.load(html.body)
    $.root()
    .find('*')
    .contents()
    .filter(function() { return this.type === 'comment'; })
    .remove()
    $("script").remove()
    const body = domainFilter(url,$)
    var turndownService = new TurndownService()
    turndownService.use(gfm)
    var markdown = turndownService.turndown(body.html())
    fs.writeFileSync(file,markdown,{flag:'a'})
}

function domainFilter(url,dom){
    var ret = null
    if(url.indexOf("cnblogs.com") > 0){
        ret = dom('#cnblogs_post_body')
    }else if(url.indexOf("stackoverflow.com") > 0){
        ret = dom('#mainbar')
    }else if(url.indexOf("blog.csdn.net") > 0){
        ret = dom('.blog-content-box')
    }
    
    if(ret.html() != null){
        return ret
    }
    return dom('body')
}

exec(cmd, function(error, stdout, stderr) {
    filePath = 'source/_posts/'+fileTitle+'.md'
    httpget(url,filePath);
});






