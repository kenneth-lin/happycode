var TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')
var gfm = turndownPluginGfm.gfm
const request = require('request')
const util = require('util')
const getPromise = util.promisify(request.get)
const exec = require('child_process').exec
const fs = require('fs')
const cheerio = require('cheerio')
const dateFormat = require('dateformat');


const argvlist = process.argv.slice(2)
const url = argvlist[0]
const fileTitle = argvlist[1]
var title = ""
if (argvlist.length > 2) {
    title = " \"" + argvlist[2] + "\""
}
var defind_content = ""
if (argvlist.length > 3) {
    defind_content = argvlist[3]
    if(defind_content == "null"){
        defind_content = ""
    }
}
var categories = ""
if (argvlist.length > 4) {
    categories = argvlist[4]
    if(categories == "null"){
        categories = ""
    }
}
var tags = ""
if (argvlist.length > 5) {
    tags = argvlist[5]
    if(tags == "null"){
        tags = ""
    }         
}
const now = dateFormat(new Date(), "yyyy-mm-dd")
const cmd = 'hexo new --path ' + now + "/" + fileTitle + title


async function httpget(url, file) {
    const html = await getPromise(url)
    const $ = cheerio.load(html.body)
    $.root()
        .find('*')
        .contents()
        .filter(function () { return this.type === 'comment'; })
        .remove()
    $("script").remove()
    const body = domainFilter(url, $,defind_content)
    var turndownService = new TurndownService()
    turndownService.use(gfm)
    var markdown = turndownService.turndown(body.html())
    markdownArr = markdown.split("\n")
    markdownArr.splice(0, 0, "[This link is from: "+url+"](" + url + ")")
    markdownArr.splice(8, 0, "<!-- more -->")
    markdown = markdownArr.join('\n')
    let filetext = fs.readFileSync(file, 'utf8')
    filetext = replaceTagsAndCategories(filetext)
    fs.writeFileSync(file, filetext, 'utf8')
    fs.writeFileSync(file, markdown, { flag: 'a' })
}

function replaceTagsAndCategories(filetext){
    if(tags != ""){
        tagsList = []
        tagsList.push("tags:")
        tagsArr = tags.split(" ")
        tagsArr.forEach((v)=>{
            tagsList.push("- " + v) 
        })
        filetext = filetext.replace("tags:",tagsList.join("\n"))
    }
    if(categories != ""){
        categoriesList = []
        categoriesList.push("categories:")
        categoriesList.push("- " + categories)
        filetext = filetext.replace("categories:",categoriesList.join("\n"))
    }
    return filetext
}

function domainFilter(url, dom,content) {
    var ret = null
    if(content != ""){
        ret = dom(content)
    } else if (url.indexOf("cnblogs.com") > 0) {
        ret = dom('#cnblogs_post_body')
    } else if (url.indexOf("stackoverflow.com") > 0) {
        ret = dom('#mainbar')
    } else if (url.indexOf("blog.csdn.net") > 0) {
        ret = dom('.blog-content-box')
    } else if (url.indexOf("npmjs.com") > 0) {
        ret = dom('article')
    } else if (url.indexOf("www.jianshu.com") > 0) {
        ret = dom('article')
    }

    if (ret.html() != null) {
        return ret
    }
    return dom('body')
}

exec(cmd, function (error, stdout, stderr) {

    filePath = 'source/_posts/' + now + '/' + fileTitle + '.md'
    httpget(url, filePath);
});
