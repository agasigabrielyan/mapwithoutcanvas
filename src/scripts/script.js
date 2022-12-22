// отображаем карту
document.addEventListener("DOMContentLoaded", function() {
    let regionsForMap = [];
    // смерджим входной объект (regionsData) с данными по позициям регионов(positions), которые собраны вручную
    for( let key in regionsData ) {
        if( positions[regionsData[key][1]] ) {
            let regionName = regionsData[key][1];
            let numberOfOrganizations = regionsData[key][3];
            regionsForMap = [...regionsForMap, new Region( regionName, numberOfOrganizations, positions ) ];
        }
    }

    // отобразим карту с объектами
    RegionsUI.putRegionsOnMap( regionsForMap );
});

$(document).on("click", ".region-cell", function( e ) {
    $(".diagram-wrapper").remove();
    if( !(document.querySelector(".diagram-wrapper")) ) {
        setTimeout(RegionsUI.showDiagramInfo( this ), 5000);
    }
});

// вспомогательный метод, который позволяет определить положение точки в процентах при клике в любом месте холста,
// закомментировать на проде
/*document.addEventListener("click",function( event ) {
    RegionsUI.getLeftTopPositions();
});*/






// classes
class Region {
    constructor( name, numOfOrganizations, positions ) {
        this.name = name;
        this.translit = this.transform( name );
        this.numOfOrganizations = numOfOrganizations;
        this.xpos = positions[name][0];
        this.ypos = positions[name][1];
    }

    transform( word ) {
        var answer = '';
        var converter = {
            'а': 'a',    'б': 'b',    'в': 'v',    'г': 'g',    'д': 'd',
            'е': 'e',    'ё': 'e',    'ж': 'zh',   'з': 'z',    'и': 'i',
            'й': 'y',    'к': 'k',    'л': 'l',    'м': 'm',    'н': 'n',
            'о': 'o',    'п': 'p',    'р': 'r',    'с': 's',    'т': 't',
            'у': 'u',    'ф': 'f',    'х': 'h',    'ц': 'c',    'ч': 'ch',
            'ш': 'sh',   'щ': 'sch',  'ь': '',     'ы': 'y',    'ъ': '',
            'э': 'e',    'ю': 'yu',   'я': 'ya',

            'А': 'A',    'Б': 'B',    'В': 'V',    'Г': 'G',    'Д': 'D',
            'Е': 'E',    'Ё': 'E',    'Ж': 'Zh',   'З': 'Z',    'И': 'I',
            'Й': 'Y',    'К': 'K',    'Л': 'L',    'М': 'M',    'Н': 'N',
            'О': 'O',    'П': 'P',    'Р': 'R',    'С': 'S',    'Т': 'T',
            'У': 'U',    'Ф': 'F',    'Х': 'H',    'Ц': 'C',    'Ч': 'Ch',
            'Ш': 'Sh',   'Щ': 'Sch',  'Ь': '',     'Ы': 'Y',    'Ъ': '',
            'Э': 'E',    'Ю': 'Yu',   'Я': 'Ya',   ' ': '_'
        };
        for (var i = 0; i < word.length; ++i ) {
            if (converter[word[i]] == undefined){
                answer += word[i];
            } else {
                answer += converter[word[i]];
            }
        }
        return answer;
    }
}

class RegionsUI {

    // метод возвращает верстку всех регионов
    static drawRegions( regionsForMap, positions ) {
        let regionsMapElems = document.createElement("div");
        regionsMapElems.classList.add("regions-map__elems");

        let previousColorForSmallCircle = 'orange';
        let longNameSpan = false;

        for( let i=0; i<regionsForMap.length; i++ ) {
            // создадим элемент, который будет содержать количество организаций
            let regionCellSatisfaction = document.createElement("div");
                regionCellSatisfaction.classList.add("region-cell__satisfaction");
                regionCellSatisfaction.innerText = regionsForMap[i].numOfOrganizations;

            // создадим элемент, который будет содержать имя региона
            let regionCellName = document.createElement("div");
                regionCellName.classList.add("region-cell__name");
            let regionSpan = document.createElement("span");
                regionSpan.classList.add("region-cell__name-span");
                regionSpan.innerText = regionsForMap[i].name;
                regionCellName.appendChild( regionSpan );

            // создадим родительский элемент региона
            let regionCell = document.createElement("div");
                regionCell.classList.add("region-cell");
                regionCell.appendChild(regionCellSatisfaction);
                regionCell.appendChild(regionCellName);

            // установим позицию конкретного региона
            regionCell.style.top = regionsForMap[i].ypos;
            regionCell.style.left = regionsForMap[i].xpos;

                // определим цвет элемента, в зависимости от количества организаций в регионе
                if( parseInt(regionsForMap[i].numOfOrganizations) < 20 ) {
                    if( previousColorForSmallCircle == 'orange' ) {
                        regionCell.classList.add("region-cell_orange");
                        previousColorForSmallCircle = 'red';
                    } else if( previousColorForSmallCircle == 'red' ) {
                        regionCell.classList.add("region-cell_red");
                        previousColorForSmallCircle = 'green';
                    } else if (previousColorForSmallCircle == 'green' ) {
                        regionCell.classList.add("region-cell_green");
                        previousColorForSmallCircle = 'orange';
                    }
                } else if( parseInt(regionsForMap[i].numOfOrganizations) >= 20 && parseInt(regionsForMap[i].numOfOrganizations) < 80 ) {
                    regionCell.classList.add("region-cell_orange");
                } else if( parseInt(regionsForMap[i].numOfOrganizations) >= 80 ) {
                    regionCell.classList.add("region-cell_green");
                }

                // установим ширину элемента regionCell в пикселях в зависимости от количества организаций в регионе
                if( parseInt(regionsForMap[i].numOfOrganizations) < 20 ) {
                    regionCell.style.width = "33.61px";
                    regionCell.style.height = "33.61px";
                }  else if( parseInt(regionsForMap[i].numOfOrganizations) > 20 && parseInt(regionsForMap[i].numOfOrganizations) < 30) {
                    regionCell.style.width = "73.89px";
                    regionCell.style.height = "73.89px";
                }  else if( parseInt(regionsForMap[i].numOfOrganizations) > 30 && parseInt(regionsForMap[i].numOfOrganizations) < 80) {
                    regionCell.style.width = "89.25px";
                    regionCell.style.height = "89.25px";
                }   else {
                    let predictWidth = parseInt(regionCell.querySelector(".region-cell__name-span").innerText.length) * 10;
                    let widthFromNumber = parseInt(regionsForMap[i].numOfOrganizations);
                    let choosenWidth = 0;

                    if( predictWidth > widthFromNumber ) {
                        choosenWidth = predictWidth;
                    } else {
                        choosenWidth = widthFromNumber;
                    }

                    regionCell.style.width = choosenWidth + "px";
                    regionCell.style.height = choosenWidth + "px";
                }

                // установим расположение относительно круга наименование региона, а так же цвет этого текста
                if( parseInt(regionsForMap[i].numOfOrganizations) < 80 ) {
                    regionCell.children[1].style.top = "50%";
                    regionCell.children[1].style.left = "calc(100% + 5px)";
                    regionCell.children[1].style.transform = "translateY(-50%)";
                } else {
                    regionCell.children[1].style.top = "50%";
                    regionCell.children[1].style.left = "50%";
                    regionCell.children[1].style.transform = "translate(-50%,-50%)";
                    regionCell.children[1].style.textAlign = "center";
                    regionCell.children[1].style.color = "#fff";

                    regionCell.children[0].style.transform = "translateX(-50%)";
                }

                // определим z-index чем больше число тем меньше z-index
                let zIndexMustBe = parseInt((1 / parseInt(regionsForMap[i].numOfOrganizations)) * 1000);
                regionCell.style.zIndex = zIndexMustBe;

                // установим ширину имени региона region-cell__name-span
                /*if( parseInt(regionsForMap[i].numOfOrganizations) < 80 ) {
                    if( !longNameSpan ) {
                        regionCell.children[1].children[0].style.width = "60px";
                        longNameSpan = true;
                    } else {
                        regionCell.children[1].children[0].style.width = "auto";
                        longNameSpan = false;
                    }
                }*/


                regionsMapElems.appendChild( regionCell );
        }
        return regionsMapElems;
    }

    // метод добавляет в родительский div .regions-map созданную верстку регионов
    static putRegionsOnMap( regionsForMap, positions ) {
        let regionsMap = document.querySelector(".regions-map");
        let regionsMapElements = this.drawRegions( regionsForMap, positions );
        regionsMap.appendChild(regionsMapElements);
    }

    // вспомогательный метод, позволяет определить в процентах положение точки при клике на холсте, удалить вызов после определения положения всех регионов
    static getLeftTopPositions() {
        let regionsMapImage = document.querySelector(".regions-map__image");
        let xPosition = event.clientX;
        let yPosition = event.clientY;

        // определим высоту и ширину нашего холста
            const body = document.body,
                  html = document.documentElement;
            const fullHeight = Math.max( body.scrollHeight,
                                   body.offsetHeight,
                                   html.clientHeight,
                                   html.scrollHeight,
                                   html.offsetHeight );
            // ширина холста определяется без скроллбара справа
            const fullWidth = document.body.clientWidth;

            // определим отступ по x и по y для клика
            let offsetX = event.offsetX;
            let offsetY = event.offsetY;

            // более подробный alert для определения левого и правого отступа при клике
            //let messageText = "Ширина 100% = " + fullWidth + "px, а x% это (offsetX/(fullWidth/100) = " + parseFloat(offsetX/(fullWidth/100)).toFixed(2) + "%";
                //messageText += "Высота 100% = " + fullHeight + "px, а y% то (offsetY/(fullHeight/100)) = " + parseFloat(offsetY/(fullHeight/100)).toFixed(2) + "%";
            // выведем сообщение в alert, где при клике на точку мы будем видеть его позиции xPos и yPos в %
            let messageText = "'" + parseFloat(offsetX/(fullWidth/100)).toFixed(2) + "%',";
                messageText += "'" + parseFloat(offsetY/(fullHeight/100)).toFixed(2) + "%'";
            alert(messageText);
    }

    static showDiagramInfo( hoveredObject ) {

        let topOffset = hoveredObject.style.top;
        let leftOffset = hoveredObject.style.left;

        let diagramItself = document.createElement('div');
        diagramItself.classList.add('diagram-itself');

        let diagramCanvas = this.getDiagramCanvas( hoveredObject );
        diagramItself.appendChild( diagramCanvas );

        let diagramCityInner = document.createElement("div");
        diagramCityInner.classList.add("diagram-city-inner");
        let someInnerHtml = "<div class='diagram-city-inner__name'>";
                someInnerHtml += hoveredObject.children[1].innerText;
            someInnerHtml += "</div>"
            someInnerHtml += "<a class='canvas-link' href='" + hoveredObject.children[1].innerText + "'>Смотреть показатели в таблице"
                someInnerHtml += "<img src='./src/images/arrow-right.svg' />"
            someInnerHtml += "</a>"


        diagramCityInner.innerHTML = someInnerHtml;

        let diagramCity = document.createElement('div');
        diagramCity.classList.add('diagram-city');
        diagramCity.appendChild( diagramCityInner );



       let diagramWrapper = document.createElement("div");
       diagramWrapper.classList.add("diagram-wrapper");

       diagramWrapper.appendChild(diagramItself);
       diagramWrapper.appendChild(diagramCity);

        diagramWrapper.style.top = topOffset;

        if( parseInt(leftOffset) < 66 ) {
            diagramWrapper.style.left = leftOffset;
        } else {
            leftOffset = (parseInt(leftOffset) - 30) + "%";
            diagramWrapper.style.left = leftOffset;
        }

        hoveredObject.parentNode.appendChild( diagramWrapper );

    }

    static removeDiagramInfo(  ) {
        let diagramWrapper = document.querySelector(".diagram-wrapper");
        diagramWrapper.parentNode.removeChild(diagramWrapper);
    }

    static getDiagramCanvas( hoveredObject ) {

        let pieChartCreated;
        let canvasCreated = document.createElement("canvas");
        canvasCreated.id = 'customCanvas';

        canvasCreated.width = 160;
        canvasCreated.height = 160;
        canvasCreated.style.position = "absolute";
        canvasCreated.style.left = "0";
        canvasCreated.style.borderRadius = "50%";

        let ctxCreated = canvasCreated.getContext("2d");
        let options = {};
        options['canvas'] = canvasCreated;
        options['colors'] = ["#4AD19D", "#F5B452", "#D94139", "#9A99A2"];
        options['data'] = {
             'Отлично' : (Math.random(1) * 100),
             'Удовлетворительно' : (Math.random(1) * 100),
             'Плохо' : (Math.random(1) * 100),
             'Нет данных' : (Math.random(1) * 100)
        };
        debugger;
        options['sizes'] = {
            left: 80,
            top: 80,
            radius: 80
        };

        pieChartCreated = new PieChart( options );

        pieChartCreated.draw();

        return canvasCreated;
    }
}

class Drawer {
    // рисует линию
    static drawLine( ctx, startX, startY, endX, endY ) {
        ctx.beginPath();
        ctx.move( startX, startY );
        ctx.line( endX, endY );
        ctx.stroke();
    }

    // рисует дугу
    static drawArc( ctx, centerX, centerY, radius, startAngle, endAngle ) {
        ctx.beginPath();
        ctx.arc( centerX, centerY, radius, startAngle, startAngle );
        ctx.stroke();
    }

    // рисует кусок диаграммы
    static drawPieslice( ctx, centerX, centerY, radius, startAngle, endAngle, color ) {
         ctx.fillStyle = color;
         ctx.beginPath();
         ctx.moveTo( centerX, centerY );
         ctx.arc( centerX, centerY, radius, startAngle, endAngle );
         ctx.closePath();
         ctx.fill();
    }
}

class PieChart {
    constructor( options ) {
        this.options = options;
        this.canvas = options.canvas;
        this.ctx = this.canvas.getContext('2d');
        this.colors = options.colors;
    }

    draw() {
        let total_value = 0;
        let color_index = 0;

        for( let category in this.options.data ) {
            let val = this.options.data[category];
            total_value += val;
        }

        let startAngle = 0;
        let nextAngle = 0;
        let sliceAngle = 0;
        for( let category in this.options.data ) {
            let val = this.options.data[category];
            sliceAngle = 2 * Math.PI * val / total_value;
            if( nextAngle > 0 ) {
                startAngle = nextAngle;
            }
            nextAngle = startAngle + sliceAngle;

            Drawer.drawPieslice (
                this.ctx,
                this.options.sizes.left,
                this.options.sizes.top,
                this.options.sizes.radius,
                startAngle,
                nextAngle,
                this.colors[color_index]
            );
            color_index++;
        }
    }
}
















// входные данные
const regionsData = [
    ["1","Санкт-Петербург","","128"],
    ["2","Москва","","81"],
    ["3","Оренбургская область","","23"],
    ["4","Курская область","","2"],
    ["5","Крым","","6"],
    ["6","Краснодарский край","","4"],
    ["7","Карачаево-Черкессия","","3"],
    ["8","Ингушетия","","11"],
    ["9","Северная осетия","","8"],
    ["10","Кабардино-Балкарская область","","15"],
    ["11","Республика Дагестан","","11"],
    ["12","Чеченская республика","","14"],
    ["13","Калмыкия","","8"],
    ["14","Астраханская область","","12"],
    ["15","Ростовская область","","3"],
    ["16","Волгоградская область","","8"],
    ["17","Саратовская область","","4"],
    ["18","Тамбовская область","","7"],
    ["19","Воронежская область","","3"],
    ["20","Курская область","","4"],
    ["21","Белгородская область","","14"],
    ["22","Орловская область","","13"],
    ["23","Брянская область","","25"],
    ["24","Смоленская область","","8"],
    ["25","Калининградская область","","3"],
    ["26","Псковская область","","4"],
    ["27","Ленинградская область","","2"],
    ["28","Новгородская область","","25"],
    ["29","Тверская область","","3"],
    ["30","Карелия","","24"],
    ["31","Мурманская область","","13"],
    ["32","Архангельская область","","14"],
    ["33","Московкая область","","17"],
    ["34","Тульская область","","3"],
    ["35","Липецкая область","","8"],
    ["36","Пензенская область","","2"],
    ["37","Алтайский край","","17"],
    ["38","Приморский край","","15"],
    ["39","Амурская область","","8"],
    ["40","Кемеровская область","","14"],
    ["41","Хабаровский край","","2"],
    ["42","Сахалинская область","","17"],
    ["43","Иркутская область","","21"],
    ["44","Новосибирская область","","13"],
    ["45","Омская область","","12"],
    ["46","Томская область","","14"],
    ["47","Красноярский край","","3"],
    ["48","Камчатский край","","3"],
    ["49","Тюменская область","","4"],
    ["50","Курганская область","","18"],
    ["51","Республика Татарстан","","35"],
    ["52","Ульяновская область","","18"],
    ["53","Самарская область","","33"],
    ["54","Чувашская область","","11"],
    ["55","Республика Марий Эл","","3"],
    ["56","Удмуртская область","","14"],
    ["57","Кировская область","","3"],
    ["58","Ханты-Мансийский АО","","14"],
    ["59","Ямало-Ненецкий АО","","15"],
    ["60","Пермский край","","15"],
    ["61","Кировская область","","4"],
    ["62","Ивановская область","","18"],
    ["63","Владимирская область","","15"],
    ["64","Рязанская область","","14"],
    ["65","Ярославская область","","3"],
    ["66","Костромская область","","15"],
    ["67","Вологодская область","","15"],
    ["68","Ненецкий АО","","3"],
    ["69","Коми республика","","14"],
];

// top, left позиции регионов на карте собранные вручную
const positions = [];
      positions["Санкт-Петербург"]                          = ["11.24%","24.97%"];
      positions["Москва"]                                   = ["28.59%", "40.40%"];
      positions["Оренбургская область"]                     = ["54.13%","56.35%"];
      positions["Курская область"]                          = ["22.19%","58.87%"];
      positions["Крым"]                                     = ["22.41%","75.55%"];

      positions['Краснодарский край']                       = ['28.15%','70.20%'];
      positions['Карачаево-Черкессия']                      = ['34.25%','84.05%'];
      positions['Ингушетия']                                = ['38.64%','95.17%'];
      positions['Северная осетия']                          = ['37.97%','86.36%'];
      positions['Кабардино-Балкарская область']             = ['42.67%','79.75%'];
      positions['Республика Дагестан']                      = ['49.14%','87.83%'];
      positions['Чеченская республика']                     = ['51.08%','83.74%'];
      positions['Калмыкия']                                 = ['47.88%','74.71%'];
      positions['Астраханская область']                     = ['44.83%','70.72%'];
      positions['Ростовская область']                       = ['32.99%','68.00%'];
      positions['Волгоградская область']                    = ['37.38%','62.33%'];
      positions['Саратовская область']                      = ['39.76%','58.03%'];
      positions['Тамбовская область']                       = ['35.67%','55.51%'];
      positions['Воронежская область']                      = ['30.60%','60.49%'];
      positions['Курская область']                          = ['23.38%','58.24%'];
      positions['Белгородская область']                     = ['21.52%','62.96%'];
      positions['Орловская область']                        = ['18.84%','54.35%'];
      positions['Брянская область']                         = ['13.55%','50.47%'];
      positions['Смоленская область']                       = ['15.19%','47.01%'];
      positions['Калининградская область']                  = ['5.88%','41.66%'];
      positions['Псковская область']                        = ['13.48%','37.46%'];
      positions['Ленинградская область']                    = ['5.81%','34.84%'];
      positions['Новгородская область']                     = ['19.21%','31.69%'];
      positions['Тверская область']                         = ['24.65%','35.05%'];
      positions['Карелия']                                  = ['20.40%','25.60%'];
      positions['Мурманская область']                       = ['18.17%','17.31%'];
      positions['Архангельская область']                    = ['25.47%','20.04%'];
      positions['Московкая область']                        = ['23.38%','45.12%'];
      positions['Тульская область']                         = ['27.77%','48.69%'];
      positions['Липецкая область']                         = ['31.57%','50.99%'];
      positions['Пензенская область']                       = ['39.46%','53.10%'];
      positions['Алтайский край']                           = ['70.66%','63.06%'];
      positions['Приморский край']                          = ['85.63%','65.37%'];
      positions['Амурская область']                         = ['75.73%','59.39%'];
      positions['Кемеровская область']                      = ['71.26%','54.88%'];
      positions['Хабаровский край']                         = ['84.29%','50.47%'];
      positions['Сахалинская область']                      = ['90.62%','57.29%'];
      positions['Иркутская область']                        = ['78.70%','46.80%'];
      positions['Новосибирская область']                    = ['70.36%','50.68%'];
      positions['Омская область']                           = ['66.57%','47.95%'];
      positions['Томская область']                          = ['74.83%','42.08%'];
      positions['Красноярский край']                        = ['82.95%','38.09%'];
      positions['Камчатский край']                          = ['87.19%','21.30%'];
      positions['Тюменская область']                        = ['70.44%','35.05%'];
      positions['Курганская область']                       = ['65.38%','37.04%'];
      positions['Республика Татарстан']                     = ['57.59%','43.34%'];
      positions['Ульяновская область']                      = ['43.86%','44.81%'];
      positions['Самарская область']                        = ['48.32%','49.84%'];
      positions['Чувашская область']                        = ['41.81%','41.81%'];
      positions['Республика Марий Эл']                      = ['51.75%','37.36%'];
      positions['Удмуртская область']                       = ['51.60%','33.47%'];
      positions['Кировская область']                        = ['47.58%','29.38%'];
      positions['Ханты-Мансийский АО']                      = ['65.82%','23.92%'];
      positions['Ямало-Ненецкий АО']                        = ['55.70%','19.52%'];
      positions['Пермский край']                            = ['53.02%','25.60%'];
      positions['Кировская область']                        = ['47.21%','28.54%'];
      positions['Ивановская область']                       = ['36.86%','35.68%'];
      positions['Владимирская область']                     = ['33.66%','38.93%'];
      positions['Рязанская область']                        = ['34.89%','45.80%'];
      positions['Ярославская область']                      = ['34.03%','32.84%'];
      positions['Костромская область']                      = ['40.13%','25.50%'];
      positions['Вологодская область']                      = ['38.12%','23.19%'];
      positions['Ненецкий АО']                              = ['41.70%','18.36%'];
      positions['Коми республика']                          = ['32.17%','16.16%'];





