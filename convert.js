const fs = require('fs');

try {
    let html = fs.readFileSync('login_raw.html', 'utf-8');

    // Extract body content if present
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) {
        html = bodyMatch[1];
    }

    // 1. Replace class with className
    html = html.replace(/class=/g, 'className=');

    // 2. Replace for with htmlFor
    html = html.replace(/for=/g, 'htmlFor=');

    // 3. Self-close empty tags
    const emptyTags = ['input', 'img', 'hr', 'br', 'meta', 'link'];
    emptyTags.forEach(tag => {
        const regex = new RegExp(`<${tag}([^>]*?)(?<!/)>`, 'gi');
        html = html.replace(regex, `<${tag}$1 />`);
    });

    // 4. Fix SVG attributes to camelCase
    const svgAttrs = [
        'fill-rule', 'clip-rule', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 
        'stroke-miterlimit', 'fill-opacity', 'stroke-opacity'
    ];
    svgAttrs.forEach(attr => {
        const camelCaseAttr = attr.replace(/-([a-z])/g, g => g[1].toUpperCase());
        const regex = new RegExp(attr + '=', 'gi');
        html = html.replace(regex, camelCaseAttr + '=');
    });

    // Clean up html comments which break JSX sometimes if inside tags
    html = html.replace(/<!--[\s\S]*?-->/g, '');

    const reactCode = `import React from 'react';\nimport { Link } from 'react-router-dom';\n\nconst Login = () => {\n  return (\n    <>\n      ${html}\n    </>\n  );\n};\n\nexport default Login;\n`;

    fs.writeFileSync('client/src/pages/auth/Login.jsx', reactCode);
    console.log('Conversion successful. Wrote to client/src/pages/auth/Login.jsx');
} catch (e) {
    console.error('Conversion failed:', e);
}
