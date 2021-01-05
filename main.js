(function () {
	const styleProps = ['color', 'fontSize', 'fontFamily', 'backgroundColor', 'lineHeight', 'letterSpacing', 'fontWeight']
	const startNode = window.document.body;
	const data = {};
	const checkSvg = `
		<svg class="svg-icon" viewBox="0 0 20 20">
			<path d="M10.219,1.688c-4.471,0-8.094,3.623-8.094,8.094s3.623,8.094,8.094,8.094s8.094-3.623,8.094-8.094S14.689,1.688,10.219,1.688 M10.219,17.022c-3.994,0-7.242-3.247-7.242-7.241c0-3.994,3.248-7.242,7.242-7.242c3.994,0,7.241,3.248,7.241,7.242C17.46,13.775,14.213,17.022,10.219,17.022 M15.099,7.03c-0.167-0.167-0.438-0.167-0.604,0.002L9.062,12.48l-2.269-2.277c-0.166-0.167-0.437-0.167-0.603,0c-0.166,0.166-0.168,0.437-0.002,0.603l2.573,2.578c0.079,0.08,0.188,0.125,0.3,0.125s0.222-0.045,0.303-0.125l5.736-5.751C15.268,7.466,15.265,7.196,15.099,7.03"></path>
		</svg>
	`

	const parseFont = (data) => {
		let html = '';
		const fontArr = Object.keys(data);
		fontArr.sort((b, a) => (parseFloat(b) || 0) - (parseFloat(a) || 0));
		fontArr.forEach((font) => {
			html += `
			<div class="si-element si-font-box" data-key=${font} data-type="fontSize">
				<span class="si-font" style="font-size: ${font};">Lorem ipsum</span> (${font})
				${checkSvg}
			</div>`
		})
		return html;
	}

	const parseColor = (data, type) => {
		let html = '';
		Object.keys(data).forEach((color) => {
			const hexColor = tinycolor(color).toHexString();
			html += `
			<div class="si-element si-color" data-key="${color}" data-type=${type}>
				<input type="color" class="si-color-input" value=${hexColor} />
				<div class="si-color-label">${hexColor}</div> ${checkSvg}
			</div>`
		})
		return html;
	}


	const dfs = (tree, parentStyle, prop, result) => {
		if (!tree) return;
		const curStyle = getComputedStyle(tree)[prop] || parentStyle;
		// exclude style that inherit from parent
		if (curStyle && curStyle !== parentStyle && curStyle !== 'rgba(0, 0, 0, 0)') {
			if (result[curStyle]) {
				result[curStyle] = [...result[curStyle], tree];
			} else {
				result[curStyle] = [tree]
			}
		}
		if (tree.childElementCount) {
			const children = tree.children;
			for (let i = 0; i < children.length; i++) {
				dfs(children[i], curStyle, prop, result)
			}
		}

	}

	styleProps.forEach((prop) => {
		const result = {}
		dfs(startNode, '', prop, result)
		console.log(prop, result)
		data[prop] = result;
	})
	console.log(data);
	const htmldata = `
      <div class="si-section">
        <div class="si-section-title">Typography</div>
        ${parseFont(data.fontSize)}
      </div>
      <div class="si-section">
        <div class="si-section-title">Colors</div>
        <div class="si-section-colors">${parseColor(data.color, 'color')}</div>
      </div>
      <div class="si-section">
        <div class="si-section-title">Background Colors</div>
        <div class="si-section-colors">${parseColor(data.backgroundColor, 'backgroundColor')}</div>
      </div>
    `

	const e = document.createElement('div');
	e.id = 'style-inspect'
	e.innerHTML = htmldata;
	document.body.append(e);

	const toggleNodes = document.getElementsByClassName('si-element');
	for (let i = 0; i < toggleNodes.length; i++) {
		const currentNode = toggleNodes[i];
		currentNode.addEventListener('click', (e) => {
			// skip on input color
			if (e.target.tagName !== 'svg' && e.target.className.includes('si-color-input')) return;
			const key = currentNode.dataset.key;
			const type = currentNode.dataset.type;
			if (currentNode.className.includes('si-selected')) {
				data[type][key].forEach((node) => {
					node.classList.remove('si-border-active')
				})
				currentNode.classList.remove('si-selected')
			} else {
				currentNode.classList.add('si-selected')
				data[type][key].forEach((node) => {
					node.classList.add('si-border-active')
				})
			}
		})
	}

	const colorNodes = document.getElementsByClassName('si-color-input');
	for (let i = 0; i < colorNodes.length; i++) {
		const currentNode = colorNodes[i];
		currentNode.addEventListener('change', (e) => {
			const type = currentNode.parentElement.dataset.type;
			const key = currentNode.parentElement.dataset.key;
			const color = currentNode.value;
			currentNode.nextElementSibling.textContent = color;
			data[type][key].forEach((node) => {
				if (type === 'color') {
					node.style.cssText += ` color: ${color} !important;`
				} else {
					node.style.cssText += ` background-color: ${color} !important;`
				}
				
			})
		})
	}

	// from https://www.w3schools.com/howto/howto_js_draggable.asp
	const siNode = document.getElementById("style-inspect");
	// reset 
	window.addEventListener("resize", () => {
		siNode.style.left = '';
		siNode.style.right = '20px';
	});

	dragElement(siNode);
	function dragElement(elmnt) {
		var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		elmnt.onmousedown = dragMouseDown;

		function dragMouseDown(e) {
			e = e || window.event;
			e.preventDefault();
			// get the mouse cursor position at startup:
			pos3 = e.clientX;
			pos4 = e.clientY;
			document.onmouseup = closeDragElement;
			// call a function whenever the cursor moves:
			document.onmousemove = elementDrag;
		}

		function elementDrag(e) {
			e = e || window.event;
			e.preventDefault();
			// calculate the new cursor position:
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
			// set the element's new position:
			elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
			elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		}

		function closeDragElement() {
			// stop moving when mouse button is released:
			document.onmouseup = null;
			document.onmousemove = null;
		}
	}

}());
