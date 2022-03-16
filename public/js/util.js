/**
 @author lomofu
 @desc
 @create 11/Mar/2022 16:01
 */
const utilModule = (function () {
    const loadScript = (url, callback) => {
        const script = document.createElement("script");
        script.type = "text/javascript";

        if (script.readyState) { //IE
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else { //Others
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.getElementsByTagName("head")[0].appendChild(script);
    }

    const useNav = () => {
        const {location: {pathname}} = window;
        router.forEach(e => {
            let active = ""
            if (e.path === pathname) {
                active = "active fredoka-semi"
            }
            $('#nav').append(`
                <li class="nav-item">
                    <a class="nav-link ${active}" href="${e.path}" onclick="return ${active === ''}"
                     style="cursor: ${active === '' ? 'pointer' : 'default'}">${e.name}</a>
                </li>`)

        })
    }

    return {
        loadScript, useNav,
    }
})()
