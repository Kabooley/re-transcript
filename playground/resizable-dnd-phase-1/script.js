const dummy_data = [
    { id: 0, subtitle: 'this is subtitle' },
    { id: 1, subtitle: 'this is subtitle' },
    { id: 2, subtitle: 'this is subtitle' },
    { id: 3, subtitle: 'this is subtitle' },
    { id: 4, subtitle: 'this is subtitle' },
    { id: 5, subtitle: 'this is subtitle' },
    { id: 6, subtitle: 'this is subtitle' },
    { id: 7, subtitle: 'this is subtitle' },
    { id: 8, subtitle: 'this is subtitle' },
    { id: 9, subtitle: 'this is subtitle' },
    { id: 10, subtitle: 'this is subtitle' },
    { id: 11, subtitle: 'this is subtitle' },
    { id: 12, subtitle: 'this is subtitle' },
    { id: 13, subtitle: 'this is subtitle' },
    { id: 14, subtitle: 'this is subtitle' },
    { id: 15, subtitle: 'this is subtitle' },
    { id: 16, subtitle: 'this is subtitle' },
    { id: 17, subtitle: 'this is subtitle' },
    { id: 18, subtitle: 'this is subtitle' },
    { id: 19, subtitle: 'this is subtitle' },
    { id: 20, subtitle: 'this is subtitle' },
    { id: 21, subtitle: 'this is subtitle' },
    { id: 22, subtitle: 'this is subtitle' },
    { id: 23, subtitle: 'this is subtitle' },
    { id: 24, subtitle: 'this is subtitle' },
    { id: 25, subtitle: 'this is subtitle' },
    { id: 26, subtitle: 'this is subtitle' },
    { id: 27, subtitle: 'this is subtitle' },
    { id: 28, subtitle: 'this is subtitle' },
    { id: 29, subtitle: 'this is subtitle' },
    { id: 30, subtitle: 'this is subtitle' },
    { id: 31, subtitle: 'this is subtitle' },
    { id: 32, subtitle: 'this is subtitle' },
    { id: 33, subtitle: 'this is subtitle' },
    { id: 34, subtitle: 'this is subtitle' },
    { id: 35, subtitle: 'this is subtitle' },
    { id: 36, subtitle: 'this is subtitle' },
    { id: 37, subtitle: 'this is subtitle' },
    { id: 38, subtitle: 'this is subtitle' },
];

const draggable = document.querySelector('.draggable');
const container = document.querySelector('.transcript-container');
const header = document.querySelector('.transcript-header');
const main = document.querySelector('.transcript-main');
const order = document.querySelector('.transcript-order');
const footer = document.querySelector('.transcript--autoscroll-wrapper');

// main.style.heightをonResizeのたびに計算する
//
// これはtranscriptサイドバーにおいてスクロールを実現するために必要な措置である
//
// この値はwindowの表示領域の高さ - footerである
const calcHeight = () => {
    const resultHeight =
        document.documentElement.clientHeight -
        parseInt(window.getComputedStyle(footer).height.replace('px', ''));

    main.style.height = resultHeight + 'px';
};

const init = () => {
    dummy_data.forEach((data) => {
        const template = `
        <div class="transcript-list" data-id="${data.id}">
            <span>${data.subtitle}</span>
        </div>
        `;
        order.insertAdjacentHTML('afterbegin', template);
    });
    calcHeight();
    window.addEventListener('resize', () => {
        calcHeight();
    });
};

window.addEventListener('DOMContentLoaded', () => {
    init();
});
