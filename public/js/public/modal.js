<<<<<<< Updated upstream
const modal = ( ) => {

    const myModal = new bootstrap.Modal(document.getElementsByTagName('.modal'), options);
    myModal.show();
}
=======
const modalModule = (function (modalId) {

        const myModal = new bootstrap.Modal(document.getElementById(modalId),options);
        return{myModal}

})();
>>>>>>> Stashed changes
