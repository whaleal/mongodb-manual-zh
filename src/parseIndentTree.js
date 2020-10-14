
function parseStringIndentTree(str) {
    const lines = str.split(/\r?\n/)
    return parseLinesIndentTree(lines, 0);
}
function parseLinesIndentTree(lines, refIndent = 0) {
    const list = lines.map(line => {
        const indent = (line.match(/^ +/) || [""])[0].length
        return { indent, line: line.trimLeft() }
    })
    return parseListWithIndentTree(list, refIndent)
}
function parseListWithIndentTree(list, refIndent = 0) {
    const ret = {}
    let firstChild = null
    // console.log(list.length)
    for (let i = 0; i < list.length; i++) {
        const obj = list[i]
        const indent = obj.indent
        if (indent > refIndent) {
            firstChild = firstChild ?? { i, obj, indent }
            // console.log(firstChild)
        }
        if (indent < refIndent) {
            break;
        };
        if (indent === refIndent) {

            // ret[i] = { obj: obj.trimLeft(), indent, lineNumber: i + 1 }
            ret[i] = obj
            if (firstChild) {
                // console.log(i, obj, ret[i - 1], ret, firstChild)
                ret[firstChild.i - 1].children = parseListWithIndentTree(list.slice(firstChild.i, i), firstChild.indent)
                firstChild = null
            }
            continue;
        }
    }
    if (firstChild) {
        // console.log(i, obj, ret[i - 1], ret, firstChild)
        ret[firstChild.i - 1].children = parseListWithIndentTree(list.slice(firstChild.i), firstChild.indent)
        firstChild = null
    }
    // console.log(ret)
    return Object.values(ret)
}

exports.parseStringIndentTree = parseStringIndentTree
exports.parseLinesIndentTree = parseLinesIndentTree
exports.parseListWithIndentTree = parseListWithIndentTree

// TEST
if (!module.parent) {
    const output = (JSON.stringify(parseStringIndentTree(`
a
    b
    c
        d
        e
f
    g
h
`), undefined, 4))
    const shouldBe = `
[
    {
        "indent": 0,
        "line": ""
    },
    {
        "indent": 0,
        "line": "a",
        "children": [
            {
                "indent": 4,
                "line": "b"
            },
            {
                "indent": 4,
                "line": "c",
                "children": [
                    {
                        "indent": 8,
                        "line": "d"
                    },
                    {
                        "indent": 8,
                        "line": "e"
                    }
                ]
            }
        ]
    },
    {
        "indent": 0,
        "line": "f",
        "children": [
            {
                "indent": 4,
                "line": "g"
            }
        ]
    },
    {
        "indent": 0,
        "line": "h"
    },
    {
        "indent": 0,
        "line": ""
    }
]`.trim()
    if (output === shouldBe) {
        "okay"
    } else {
        console.log(output)
        throw new Error("some thing goes wrong, maybe output is not correctly formatted")
    }
}

/* result:



*/