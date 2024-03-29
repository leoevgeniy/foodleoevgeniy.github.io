/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/modules/calc.js":
/*!********************************!*\
  !*** ./src/js/modules/calc.js ***!
  \********************************/
/***/ ((module) => {

function calc() {
    const result = document.querySelector('.calculating__result span');
   
    let sex, height, weight, age, ratio;
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }
    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', '1.375');
    }
        
        
       function initLocalSettings(selector, activeClass) {
        const element = document.querySelectorAll(selector);
        console.log(selector);

        element.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        });
        }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    function calcTotal() {
        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '____';
            return;
        }

        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }



    calcTotal();

    function getStaticInformation(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.addEventListener('click', (e) => {
                if (e.target.getAttribute('data-ratio')) {
                    ratio = +e.target.getAttribute('data-ratio');
                    localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));
                } else {
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
            calcTotal();
    
            elements.forEach(elem => {
                elem.classList.remove(activeClass);
            });
    
            e.target.classList.add(activeClass);
            });
        });
        
    }

    getStaticInformation('#gender div', 'calculating__choose-item_active');
    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    function getDinamicInformation(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {
            if (input.value.match(/\D/g)) {
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }
            switch(input.getAttribute('id')){
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }


    getDinamicInformation('#height');
    getDinamicInformation('#weight');
    getDinamicInformation('#age');
}

module.exports = calc;

/***/ }),

/***/ "./src/js/modules/cards.js":
/*!*********************************!*\
  !*** ./src/js/modules/cards.js ***!
  \*********************************/
/***/ ((module) => {

function cards () {
    class menuCard {
        constructor(altimg, img, title, descr, price, parentSelector, ...classes) {
            this.img = img;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.altimg = altimg;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }
        changeToUAH() {
            this.price = this.price * this.transfer;
        }
        
        render() {
           
            const element = document.createElement('div');
            if (this.classes.length === 0) {
                this.element = 'menu__item';
                element.classList.add(this.element);
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            
            element.innerHTML = `
                <img src=${this.img} alt=${this.altimg}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);

        }

    }
        // getResource('http://localhost:3000/menu')
    // .then(data => {
    //     data.forEach(({altimg, img, title, descr, price}) => {
    //         new menuCard(altimg, img, title, descr, price, '.menu .container').render();
    //     });
    // });

    // getResource('http://localhost:3000/menu')
    //     .then(data => createCard(data));
    axios.get('http://localhost:3000/menu')
    .then(data => {
            data.data.forEach(({altimg, img, title, descr, price}) => {
                new menuCard(altimg, img, title, descr, price, '.menu .container').render();
            });
    });





}

module.exports =cards;

/***/ }),

/***/ "./src/js/modules/forms.js":
/*!*********************************!*\
  !*** ./src/js/modules/forms.js ***!
  \*********************************/
/***/ ((module) => {

function forms() {
    //Forms
    
    const forms = document.querySelectorAll('form'),
          message = {
              loading: 'img/form/spinner.svg',
              success: 'Спасибо! Скоро мы с Вами свяжемся',
              failure: 'Что-то пошло не так'
          };
    
    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });

        return await res.json();
    };


    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);



            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

             postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);  
                statusMessage.remove();
            })
            .catch(() => {
                showThanksModal(message.failure);
            })
            .finally(() => {
                form.reset();
            });
        }); 
    }

 
}

module.exports = forms;

/***/ }),

/***/ "./src/js/modules/modal.js":
/*!*********************************!*\
  !*** ./src/js/modules/modal.js ***!
  \*********************************/
/***/ ((module) => {

function modal() {
    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');
        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;

        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }
        //Tabs
    

    

    // Cards
    // function addCard(menuCard) {
    //     const menu = document.querySelector('.menu .container'),
    //       item = document.createElement('div'),
    //       image = document.createElement('img'),
    //       h3 = document.createElement('h3'),
    //       descr = document.createElement('div'),
    //       divider = document.createElement('div'),
    //       price = document.createElement('div'),
    //       cost = document.createElement('div'),
    //       total = document.createElement('div'),
    //       totalSpan = document.createElement('span');
    // item.classList.add('menu__item');
    // menu.appendChild(item);
    // image.src = menuCard.img;
    // image.alt = menuCard.name;
    // item.appendChild(image);
    // h3.classList.add('menu__item-subtitle');
    // h3.innerHTML = menuCard.title;
    // item.appendChild(h3);
    // descr.classList.add('menu__item-descr');
    // descr.innerHTML = menuCard.content;
    // item.appendChild(descr);
    // divider.classList.add('menu__item-divider');
    // item.appendChild(divider);
    // price.classList.add('menu__item-price');
    // item.appendChild(price);
    // cost.classList.add('menu__item-cost');
    // cost.innerHTML = 'Цена:';
    // price.appendChild(cost);
    // total.classList.add('menu__item-total');
    // price.appendChild(total);
    // total.innerHTML = `<span>${menuCard.price}</span> гре/день`;
    // }



    

    // const fitness = new menuCard('vegy', 'img/tabs/vegy.jpg', 'Меню"Фитнес"', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 229);
    // const elite = new menuCard('vegy', 'img/tabs/elite.jpg', 'Меню"Фитнес"', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 229);
    // const post = new menuCard('vegy', 'img/tabs/post.jpg', 'Меню"Фитнес"', 'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!', 229);

    // addCard(fitness);
    // addCard(elite);
    // addCard(elite);
    // addCard(post);
    // addCard(post);
    // const getResource = async (url) => {
    //     const res = await fetch(url);
        
    //     if (!res.ok) {
    //        throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    //     }

    //     return await res.json();
    // };
    





    // function createCard(data) {
    //     data.forEach(({altimg, img, title, descr, price}) => {
    //         const element = document.createElement('div');

    //         element.classList.add('menu__item');
    //         element.innerHTML = `
    //             <img src=${img} alt=${altimg}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${descr}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${price}</span> грн/день</div>
    //             </div>
    //         `;

    //         document.querySelector('.menu .container').append(element);
    //     });
    // }
    // new menuCard(
    //     'vegy',
    //     'img/tabs/vegy.jpg',
    //     'Меню"Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     100,
    //     '.menu .container'

    // ).render();
    // new menuCard(
    //     'vegy',
    //     'img/tabs/vegy.jpg',
    //     'Меню"Фитнес"',
    //     'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    //     100,
    //     '.menu .container'

    // ).render();

    

    // fetch('http://localhost:3000/menu')
    //     .then(data => data.json())
    //     .then(res => console.log(res));


    // Slider
    // my code
    // const counter = document.querySelector('.offer__slider-counter'),
    //       current = counter.querySelector('#current'),
    //       total = counter.querySelector('#total'),
    //       prev = counter.querySelector('.offer__slider-prev'),
    //       next = counter.querySelector('.offer__slider-next'),
    //       slider = document.querySelectorAll('.offer__slide');
    // let   i = 1;

    // current.innerHTML = `0${i}`;
    // total.innerHTML = `04`;

    // function hideSlide() {
    //     slider.forEach((element, item) => {
    //     if (item === i - 1) {
    //         element.style.display = 'block';
    //     } else {
    //         element.style.display = 'none';
    //     }
    // });
    // }

    // function sliderClick () {
    //     prev.addEventListener('click', (e)=> {
    //        if (i === 1) {
    //         i = +total.innerHTML;
    //         current.innerHTML = `0${i}`;
    //         hideSlide();
    //        } else {
    //            i--;
    //            current.innerHTML = `0${i}`;
    //            hideSlide();
    //        }
    //     });
    //     next.addEventListener('click', (e)=> {
    //        if (i === 4) {
    //         i = 1;
    //         current.innerHTML = `0${i}`;
    //         hideSlide();
    //        } else {
    //            i++;
    //            current.innerHTML = `0${i}`;
    //            hideSlide();
    //        }
    //     });
    // }

   

    

    //easy option slider
    // showSlides(slideIndex);
    // if (slides.length < 10) {
    //     total.textContent = `0${slides.length}`;
    // } else {
    //     total.textContent = `${slides.length}`;
    // }

    // function showSlides(n) {
    //     if (n > slides.length) {
    //         slideIndex = 1;
    //     }

    //     if (n < 1) {
    //         slideIndex = slides.length;
    //     }
    //     slides.forEach(item => {
    //         item.style.display = 'none';
    //     });
    //     slides[slideIndex - 1].style.display = '';
    //     if (slides.length < 10) {
    //         current.textContent = `0${slideIndex}`;
    //     } else {
    //         current.textContent = slideIndex;
    //     }
    // }

    // function plusSlides (n) {
    //     showSlides(slideIndex += n);
    // }

    // prev.addEventListener('click', () => {
    //     plusSlides(-1);
    // });
    // next.addEventListener('click', () => {
    //     plusSlides(1);
    // });

    //dotes slider

    //calculator

    
}
module.exports = modal;

/***/ }),

/***/ "./src/js/modules/slider.js":
/*!**********************************!*\
  !*** ./src/js/modules/slider.js ***!
  \**********************************/
/***/ ((module) => {

function slider() {
    // sliderClick();

    const slides = document.querySelectorAll ('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current'),
    slidesWrapper = document.querySelector('.offer__slider-wrapper'),
    slidesField = document.querySelector('.offer__slider-inner'),
    width = window.getComputedStyle(slidesWrapper).width,
    slider = document.querySelector('.offer__slider');
        

    let slideIndex = 1;
    let offset = 0;

    if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
    current.textContent = `0${slideIndex}`;
    } else {
    total.textContent = `${slides.length}`;
    current.textContent = slideIndex;
    }


    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.8s all';

    slidesWrapper.style.overflow = 'hidden';
    slides.forEach(slide => {
    slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
    dots = [];

    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 15;
    display: flex;
    justify-content: center;
    margin-right: 15%;
    margin-left: 15%;
    list-style: none;
    `;
    slider.append(indicators);

    for (let iter = 0; iter < slides.length; iter++) {
    const dot = document.createElement('li');
    dot.setAttribute('data-slide-to', iter + 1);
    dot.style.cssText = `
        box-sizing: content-box;
        flex: 0 1 auto;
        width: 30px;
        height: 6px;
        margin-right: 3px;
        margin-left: 3px;
        cursor: pointer;
        background-color: #fff;
        background-clip: padding-box;
        border-top: 10px solid transparent;
        border-bottom: 10px solid transparent;
        opacity: .5;
        transition: opacity .6s ease;
    `;
    if (iter == 0) {
        dot.style.opacity = 1;
    }
    indicators.append(dot);
    dots.push(dot);
    }

    function deleteNotDigits(str) {
    return +str.replace(/\D/g, '');
    }

    next.addEventListener('click', () => {
    if (offset === deleteNotDigits(width) * (slides.length - 1)) {
        offset = 0;
    } else {
        offset += deleteNotDigits(width);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == slides.length) {
        slideIndex = 1;
    }else {
        slideIndex++;
    }

    if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    }

    dots.forEach(dot => {
        dot.style.opacity = '0.5';
        dots[slideIndex - 1].style.opacity = 1;
    });
    });
    prev.addEventListener('click', () => {
    if (offset === 0) {offset = deleteNotDigits(width) * (slides.length - 1);} else {
        offset -= deleteNotDigits(width);
    }

    slidesField.style.transform = `translateX(-${offset}px)`;

    if (slideIndex == 1) {
        slideIndex = slides.length;
    }else {
        slideIndex--;
    }

    if (slides.length < 10) {
        current.textContent = `0${slideIndex}`;
    } else {
        current.textContent = slideIndex;
    }

    dots.forEach(dot => {
        dot.style.opacity = '0.5';
        dots[slideIndex - 1].style.opacity = 1;
    });


    });

    dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        const slideTo = e.target.getAttribute('data-slide-to');

        slideIndex = slideTo;
        offset = deleteNotDigits(width) * (slideIndex - 1);
        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slides.length < 10) {
            current.textContent = `0${slideIndex}`;
        } else {
            current.textContent = slideIndex;
        }

        dots.forEach(dot => {
            dot.style.opacity = '0.5';
            dots[slideIndex - 1].style.opacity = 1;
        });
    });
    });
}

module.exports = slider;

/***/ }),

/***/ "./src/js/modules/tabs.js":
/*!********************************!*\
  !*** ./src/js/modules/tabs.js ***!
  \********************************/
/***/ ((module) => {

function tabs() {
    const tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items'),
          tabs = document.querySelectorAll('.tabheader__item');

    function hideTabContent() {
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');

        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) => {
        const target = event.target;

        if (target && target.classList.contains('tabheader__item')) {
            tabs.forEach((item, i) => {
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
}

module.exports = tabs;

/***/ }),

/***/ "./src/js/modules/timer.js":
/*!*********************************!*\
  !*** ./src/js/modules/timer.js ***!
  \*********************************/
/***/ ((module) => {

function timer() {
//Timer

    const deadline = '2022-05-30';

    function getTimeRemaining(endtime) {
        const t = Date.parse(endtime) - Date.parse(new Date()),
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60) % 24)),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);

        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);
            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }
    setClock('.timer', deadline);

    //Modal

    const modalbtn = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
    }

    modalbtn.forEach(item => {
        item.addEventListener('click', openModal);
    });

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.getAttribute('data-close') == '') {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && modal.classList.contains('show')) {
            modal.classList.add('hide');
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

}

module.exports = timer;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/js/main.js ***!
  \************************/
window.addEventListener('DOMContentLoaded', () => {
    const tabs = __webpack_require__(/*! ./modules/tabs */ "./src/js/modules/tabs.js"),
          modal = __webpack_require__(/*! ./modules/modal */ "./src/js/modules/modal.js"),
          timer = __webpack_require__(/*! ./modules/timer */ "./src/js/modules/timer.js"),
          cards = __webpack_require__(/*! ./modules/cards */ "./src/js/modules/cards.js"),
          calc = __webpack_require__(/*! ./modules/calc */ "./src/js/modules/calc.js"),
          forms = __webpack_require__(/*! ./modules/forms */ "./src/js/modules/forms.js"),
          slider = __webpack_require__(/*! ./modules/slider */ "./src/js/modules/slider.js");
    
          tabs();
          modal();
          timer();
          cards();
          calc();
          forms();
          slider();
});
})();

/******/ })()
;
//# sourceMappingURL=script.js.map