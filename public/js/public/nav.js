/** @format */
import { router } from "/js/public/constant.js";

const _useRouter = () => {
  const {
    location: { pathname },
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

// create new story modal
const _useStoryModal = () => {
  const { useCreateStoryModal, resetStoryModel } = newStoryModule;
  const myModalEl = document.getElementById("storyModal");
  myModalEl.addEventListener("show.bs.modal", () => useCreateStoryModal());
  myModalEl.addEventListener("hidden.bs.modal", () => resetStoryModel());
};

export const useNav = () => {
  _useRouter();
  _useStoryModal();
};
