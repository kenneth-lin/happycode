var TurndownService = require('turndown')
var turndownPluginGfm = require('turndown-plugin-gfm')
var gfm = turndownPluginGfm.gfm
var tables = turndownPluginGfm.tables
var strikethrough = turndownPluginGfm.strikethrough
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
    const body = $('body')
    var turndownService = new TurndownService()
    turndownService.use(gfm)
    turndownService.use([tables, strikethrough])    
    var markdown = turndownService.turndown(body.html())
    fs.writeFileSync(file,markdown,{flag:'a'})
}

exec(cmd, function(error, stdout, stderr) {
    filePath = 'source/_posts/'+fileTitle+'.md'
    httpget(url,filePath);
});






