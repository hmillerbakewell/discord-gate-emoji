let fs = require('fs')

// http://nodejs.org/api.html#_child_processes

var exec = require('child_process').exec;

function puts(error, stdout, stderr) {
    console.log(stdout)
    console.log(error)
    console.log(stderr)
}

let redNode = {
    name: "RedCircle",
    svg: `<circle
    style="display:inline;opacity:1;fill:#e8a5a5;fill-opacity:1;stroke:#000000;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
    cx="50"
    cy="50"
    r="25" />`
}
let wire = {
    name: "Wire",
    svg: ``
}

let greenNode =
{
    name: "GreenCircle",
    svg: `<circle
    style="display:inline;opacity:1;fill:#d8f8d8;fill-opacity:1;stroke:#000000;stroke-width:4;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
    cx="50"
    cy="50"
    r="25" />`
}

let whiteNode =
{
    name: "WhiteSquare",
    svg: `<rect
    style="display:inline;opacity:1;fill:#FFFFFF;fill-opacity:1;stroke:#000000;stroke-width:5;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
    width="50"
    height="50"
    x="25"
    y="25" />`
}

let leftWire = `<rect
style="display:inline;opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.52916664;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
width="50"
height="10"
x="0"
y="45" />`

let rightWire = `<rect
style="display:inline;opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.52916664;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
width="50"
height="10"
x="50"
y="45" />`

let downWire = `<rect
style="display:inline;opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.52916664;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
width="10"
height="50"
x="45"
y="50" />`

let upWire = `<rect
style="display:inline;opacity:1;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.52916664;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
width="10"
height="50"
x="45"
y="0" />`

let lr_bases = [{
    name: "l",
    svg: leftWire
},
{
    name: "r",
    svg: rightWire
},
{
    name: "lr",
    svg: leftWire + rightWire
},
]

let all_bases = [
    {
        name: "l",
        svg: leftWire
    },
    {
        name: "r",
        svg: rightWire
    },
    {
        name: "lr",
        svg: leftWire + rightWire
    },
    {
        name: "dlr",
        svg: downWire + leftWire + rightWire
    },
    {
        name: "ulr",
        svg: upWire + leftWire + rightWire
    },
    {
        name: "udlr",
        svg: upWire + downWire + leftWire + rightWire
    },
]




let write = function (filename, inner) {
    let s = `
    <svg
    width="100"
    height="100">
${inner}
    </svg>
    `
    fs.writeFile(`./svg/${filename}.svg`, s, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
        exec(`inkscape -z -f ./svg/${filename}.svg -w 1024 -h 1024 -e ./png/${filename}.png`, puts)
    })
}

let text = function (input) {
    return `<flowRoot
     xml:space="preserve"
     id="flowRoot4536"
     style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:10.66666698px;line-height:1.25;font-family:Arial;-inkscape-font-specification:Arial;text-align:center;letter-spacing:0px;word-spacing:0px;text-anchor:middle;fill:#000000;fill-opacity:1;stroke:none"><flowRegion
       id="flowRegion4538"
       style="text-align:center;text-anchor:middle"><rect
         id="rect4540"
         width="60"
         height="20"
         x="20"
         y="40"
         style="text-align:center;text-anchor:middle" /></flowRegion><flowPara
       id="flowPara4542"
       style="font-size:16px">${input}</flowPara></flowRoot>`
}

let makeBaseAndGate = function (base, gate) {
    return `
    <g>
    <rect
           style="opacity:1;fill:#ffffff;fill-opacity:0.26341462;stroke:none;stroke-width:0.52916664;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-dashoffset:0;stroke-opacity:1"
           id="rect5102"
           width="100"
           height="100"
           x="0"
           y="0" />
    </g>
    <g>
    ${base.svg}
    </g>
    <g>
    ${gate.svg}
    </g>`
}

for (let base of all_bases) {
    for (let gate of [redNode, greenNode]) {
        let inner = makeBaseAndGate(base, gate)
        write(`${gate.name}_${base.name}`, inner)
    }
}
for (let base of [
    {
        name: "lr",
        svg: leftWire + rightWire
    },
    {
        name: "udlr",
        svg: upWire + downWire + leftWire + rightWire
    },]) {
    for (let gate of [wire]) {
        let inner = makeBaseAndGate(base, gate)
        write(`${gate.name}_${base.name}`, inner)
    }
}
for (let gate of [whiteNode]) {
    let base = {
        name: "lr",
        svg: leftWire + rightWire
    }
    let inner = makeBaseAndGate(base, gate)
    write(`${gate.name}_${base.name}`, inner)
}

for (let gate of [redNode, greenNode]) {
    for (let label of [
        { name: "Pi4", label: "π / 4" },
        { name: "Pi2", label: "π / 2" },
        { name: "3Pi4", label: "3π / 4" },
        { name: "Pi", label: "π" },
        { name: "5Pi4", label: "5π / 4" },
        { name: "3Pi2", label: "3π / 2" },
        { name: "7Pi4", label: "7π / 4" }
    ]) {
        let base = {
            name: "lr",
            svg: leftWire + rightWire
        }
        let inner = makeBaseAndGate(base, gate) + text(label.label)
        write(`${gate.name}_${label.name}_${base.name}`, inner)
    }
}