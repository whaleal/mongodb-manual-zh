
const Crawler = require("crawler");
const path = require("path");
const { JSDOM } = require('jsdom');
const fs = require("fs");
const { parseListWithIndentTree } = require("./parseIndentTree");

const main = async () => {
    const c = new Crawler({
        maxConnections: 10,
        rateLimit: 1000, // `maxConnections` will be forced to 1
        jQuery: false,
        // This will be called for each crawled page
        callback: async function (error, res, done) {
            if (error) {
                // console.log(error);
            } else {
                await parsePage(res);
            }
            done();
        }
    });

    // Queue mongodb manual with custom callbacks & parameters
    c.queue([{
        uri: 'https://docs.mongodb.com/manual/',
        jQuery: false,
        // The global callback won't be called
        callback: async function (error, res, done) {
            if (error) {
                // console.log(error);
            } else {
                await parsePage(res);
            }
            // console.log(links);
            done();
        }
    }]);
}

if (!module.parent) main().then(console.log).catch(console.error)
exports = main;

// // // Queue just one URL, with default callback
// c.queue('https://docs.mongodb.com/manual/');

const promise_mkdir_debug = fs.promises.mkdir("debug/", { recursive: true }).then(console.log)
const promise_mkdir_img = fs.promises.mkdir("img/", { recursive: true }).then(console.log)
const promise_mkdir_dist = fs.promises.mkdir("docs/", { recursive: true }).then(console.log)
async function parsePage(res) {
    await promise_mkdir_debug;
    await saveJSON("debug/res.json", res);

    const { document } = (new JSDOM(res.body)).window;
    const root = document.querySelector("#sphinxsidebar>*>ul")

    const linklist = [...document.querySelector("#sphinxsidebar>*>ul").querySelectorAll("a[href]")].map((e, index) => {
        let level = 0, levelElement = e
        do { levelElement = levelElement.parentElement.parentElement } while (levelElement.tagName === "UL" && ++level)
        const _href = e.href
        const href = (_href.match(/^https?:.*/) ? _href : "https://docs.mongodb.com/manual/" + _href)
        const relativeSafePath = _href.replace(/[:%~]/g, '-')
        const dir = path.join("docs", path.dirname(relativeSafePath))
        const filename = path.basename(relativeSafePath) + ".md"
        const nodename = path.basename(relativeSafePath)
        const filepath = path.join(dir, filename)
        return { index, level, indent: level - 1, title: e.textContent, href: href, dir, filename, nodename, filepath }
    });
    saveJSON("debug/linklist.json", linklist)

    const linkTree = parseListWithIndentTree(linklist)
    saveJSON("debug/linkTree.json", linkTree)

    const fullLinkTree = modifyTree(linkTree)
    saveJSON("debug/fullLinkTree.json", fullLinkTree)

    generatePlaceHoldersFromTree(fullLinkTree)

    const mdTOC = linklist.map(({ level, title, href }) =>
        "  ".repeat(level - 1) + `- [${title}]( ${href} )`).join('\n');
    await promise_mkdir_dist;
    save("docs/__-toc.md", mdTOC)
}

function pushToLinks(e) {
    return links.push(e);
}

async function saveJSON(filename, res) {
    await fs.promises.writeFile(filename, JSON.stringify(res, undefined, 4));
}
async function save(filename, data) {
    await fs.promises.writeFile(filename, data);
}


function modifyTree(tree, rootNode = null) {
    return tree.map((e, order) => {
        order = order < 100 ? ('000' + (order + 1)).slice(-2) : 99
        const nodefilename = order + "-" + e.nodename
        // const nodefilename = e.nodename
        const designFolderPath = rootNode ? rootNode.designFolderPath + '/' + nodefilename : nodefilename
        // const designFolderPath = e.nodename
        const designFilePath = designFolderPath + ".md"

        return ({
            ...e, nodefilename, designFolderPath, designFilePath,
            children: e.children && modifyTree(e.children, { ...e, designFolderPath })
        })
    })
}

async function generatePlaceHoldersFromTree(tree, rootNode = null) {
    return await Promise.all(tree.map(async (e) => {
        const { designFilePath, href, title, children } = e

        // folder
        // await fs.promises.mkdir('docs/' + designFolderPath, { recursive: true }).catch(e => e.code === 'EEXIST' || console.error(e))
        await fs.promises.mkdir(path.dirname('docs/' + designFilePath), { recursive: true }).catch(e => e.code === 'EEXIST' || console.error(e))

        // markdown placeholder
        const content = await fs.promises.readFile('docs/' + designFilePath, 'utf8').catch(() => "")
        if ((content.indexOf(href) !== -1) && (content.indexOf(title) !== -1)) {
            // 如果英文官方版对应链接存在于文档中，就可以跳过了
            // PASS
        } else {
            // 如果没有的话，就自动补上参见
            await fs.promises.writeFile(
                'docs/' + designFilePath,
                `\n\n## 参见\n\n原文 - [${title}]( ${href} )\n\n`,
                { flag: "a" }
            )
        }

        // children
        children && generatePlaceHoldersFromTree(children, e)
    }))
}
