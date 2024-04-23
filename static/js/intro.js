function getPageList(totalPages, page, maxLength){
    function range(start, end){
        return Array.from(Array(end - start + 1), (_, i) => i + start);
    }
    var sideWidth = maxLength < 9 ? 1 : 2;
    var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
    var rightWidth = (maxLength - sideWidth * 2 - 3) >> 1;

    if(totalPages <= maxLength){
        return range(1, totalPages);

    }

    if(page <= maxLength - sideWidth - 1 - rightWidth){
        return range(1, maxLength - sideWidth - 1).concat(0, range(totalPages - sideWidth + 1, totalPages));
    }
    if(page >=  totalPages - sideWidth - 1  - rightWidth){
        return range(1, sideWidth).concat(0, range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));

    }
    return range(1, sideWidth).concat(0, range(page - leftWidth, page + rightWidth), 0, range(totalPages - sideWidth + 1, totalPages));
}




$(function(){
    var numberOfItems = $(".card-content .card").length;
    var limitPerPage = 4;
    var totalPages = Math.ceil(numberOfItems / limitPerPage);
    var paginationSize = 5;
    var currentPage;
    var previousScroll = $(window).scrollTop();
    var currentPage = 1; 
    var maxPages = 4; 
    showPage(currentPage - 1);
    $(window).scrollTop(previousScroll);

    function changePage() {
        currentPage++;  
        if (currentPage > maxPages) {
            currentPage = 1;    
        }
        showPage(currentPage);  
    }   


    var pageInterval = setInterval(changePage, 5000); 


    $('.sec-03').hover(function() {
        clearInterval(pageInterval); 
    }, function() {
        pageInterval = setInterval(changePage, 5000); 
    });

    function showPage(whichPage){
        if(whichPage < 1 || whichPage > totalPages) return false;

        currentPage = whichPage;
        $(".card-content .card").hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();

        $(".pagination li").slice(1, -1).remove();
        getPageList(totalPages, currentPage, paginationSize).forEach(item => {
            $("<li>").addClass("page-item").addClass(item ? "current-page": "dots")
                .toggleClass("active", item === currentPage).append($("<a>").addClass("page-links")
                .attr({href: "javascript:void(0)"}).text(item || "...")).insertBefore(".next-page");
        });


        $(".previous-page").toggleClass("disable", currentPage === 1);
        $(".next-page").toggleClass("disable", currentPage === totalPages);
        return true;
    }

    $(".pagination").append(
        $("<li>").addClass("page-item").addClass("previous-page").append($("<a>").addClass("page-links").attr({href: "javascript:void(0)"}).text("Prev")),
        $("<li>").addClass("page-item").addClass("next-page").append($("<a>").addClass("page-links").attr({href: "javascript:void(0)"}).text("Next"))
    );

    $(".card-content").show();
    showPage(1);

    $(document).on("click", ".pagination li.current-page:not(.active)", function(){
        return showPage(+$(this).text());
    });

    $(".next-page").on("click", function(){
        return showPage(currentPage + 1);
    });

    $(".previous-page").on("click", function(){
        return showPage(currentPage - 1);
    });
});


    ScrollReveal({ 
        reset: false,
        distance: '60px',
        duration: 2500,
        delay: 400,
    
    });

    ScrollReveal().reveal('.main-title', {delay: 100});
    ScrollReveal().reveal('.section-title', {delay: 100, origin: 'left'});
    ScrollReveal().reveal('.sec-01 .image', {delay: 100, origin: 'bottom'});
    ScrollReveal().reveal('.text-box', {delay: 200, origin: 'right'});
    ScrollReveal().reveal('.team-info', {delay: 200, origin: 'right', interval: 100});
    ScrollReveal().reveal('.sec-02 .image', {delay: 200, origin: 'left'});
    ScrollReveal().reveal('.info', {delay: 100, origin: 'top'});
    ScrollReveal().reveal('.section-title2', {delay: 100, origin: 'top'});
    ScrollReveal().reveal('.sec-03 .card-content', {delay: 100, origin: 'bottom'});
    ScrollReveal().reveal('.pagination', {delay: 100, origin: 'bottom'});






