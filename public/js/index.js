/**
 @author lomofu
 @desc
 @create 11/Mar/2022 18:12
 */

const indexModule = (function () {
    const useCards = () => {
        let interval;
        const createAnimation = () => setInterval(() => $('.card--next').first().trigger('click'), 4000);
        $.fn.commentCards = function () {
            return this.each(function () {
                let $this = $(this), $cards = $this.find('.card-dy'), $current = $cards.filter('.card--current'), $next;
                $cards.on('click', function () {
                    if (!$current.is(this)) {
                        $cards.removeClass('card--current card--out card--next');
                        $current.addClass('card--out');
                        $current = $(this).addClass('card--current');
                        $next = $current.next();
                        $next = $next.length ? $next : $cards.first();
                        $next.addClass('card--next');
                    }
                });

                if (!$current.length) {
                    $current = $cards.last();
                    $cards.first().trigger('click');
                }
                $this.addClass('cards--active');
            })
        };

        $('.cards').commentCards();
        interval = createAnimation();

        $('.card--current').hover(() => {
            $('.card--current').addClass('shadow-lg');
            clearInterval(interval);
        }, () => {
            $('.card--current').removeClass('shadow-lg');
            interval = createAnimation();
        });
    }
    return {
        useCards
    }
})()


