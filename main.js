function dfs(tree, parentStyle, prop, result) {
    if (!tree) return;
    const curStyle = getComputedStyle(tree)[prop] || parentStyle;
    if (curStyle && curStyle !== parentStyle) {
        if (result[curStyle]) {
            result[curStyle] = [...result[curStyle], tree];
        } else {
            result[curStyle] = [tree]
        }
    }
    if(tree.childElementCount) {
        const children = tree.children;
        for(let i=0; i< children.length; i++ ) {
            dfs(children[i], curStyle, prop, result)
        }
    }
    
}

function run () {
    // start at html tag
    const styleProps = ['color', 'fontSize', 'lineHeight', 'fontFamily', 'backgroundColor']
    const startNode = window.document.children[0];
    console.log('unique style being used in this page');
    styleProps.forEach((prop) => {
        const result = {}
        dfs(startNode, '', prop, result)
        console.log(prop, result)
    })
}

run();
