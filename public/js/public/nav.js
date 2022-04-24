/** @format */
import {router} from "/js/public/constant.js";

const _useRouter = () => {
    const {
        location: {pathname},
    } = window;
    router.forEach((e) => {
        let active = "";
        if (e.path === pathname) {
            active = "active fredoka-semi";
        }

        $("#nav").append(`
        <li class="nav-item">
            <a class="nav-link ${active}" 
                href="${e.path}" 
                onclick="return ${active === ""}"
                style="cursor: ${active === "" ? "pointer" : "default"}"
            >
                ${e.name}
            </a>
        </li>`);
    });
};

export const useNav = () => {
    _useRouter();
};
