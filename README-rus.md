Echolot.js
==========

Библиотека для отладки выражений в JavaScript. Особенно полезна для кода в 
функциональном стиле.

Motivation
----------

Традиционные инструменты отладки JavaScript применимы минимум к инструкции. 
Например можно вставить инструкцию `debugger;` или поставить останов на 
инструкцию в отладчике. Есть разные способы распечатать значение, например 
`console.log()`, но, как правило, они должны быть добавлены в код как отдельная 
инструкция.

Echolot предоставляет инструменты для более гибкой отладки, для отладки 
выражений, входящих в состав инструкции, что позволяет не дробить выражение на 
отдельные инструкции в целях отладки.

Например есть функция:

    const calc = x => x + 1;

Если для отладки требуется узнать значение "x", то придётся переписать функцию 
в императивном стиле, в виде набора инструкций:

    const calc = x => {
        console.log(x);
        return x + 1;
    };

Echolot позволяет не тратить на это время и не отходить от функциональной 
парадигмы. Например два способа как можно решить ту же задачу:

    const calc = x => E.v(x) + 1; // Распечатать выражение "x"
    const calc = E.f(x => x + 1); // Распечатывать параметры и возврат arrow-функции

Более сложный пример с использованием функциональной библиотеки 
[Ramda](http://ramdajs.com):

    // extract :: [[Item]] -> [a]
    //   Item = {enabled: Boolean, raw: a}
    const extract = R.pipe(
        R.map(R.last),
        E.f(R.filter(R.prop("enabled"))), // Покажет что передаётся на второй шаг pipe'а
        R.map(R.prop("raw"))
    );
    $http.post("myURL" extract(links));


Install
-------
С помощью пакетного менеджера:

    npm install echolotjs --save-dev
    bower install echolotjs --save-dev


Initialization
--------------
Рекомендуемый способ инициализировать библиотеку для большого проекта:

    // In browser
    window.E = echolot;

    // In Node.js
    global.E = require("echolot");

Либо, если скриптов мало, или по каким-то причинам не хочется захламлять 
глобальную область видимости:

    // In browser
    const E = echolot;

    // In Node.js
    const E = require("echolot");


Watching a Value
----------------
Утилита `E.v()` ("v" означает "value") просто распечатывает массив из принятых 
в качестве аргументов значений. Главное отличие от `console.log()` в том, что 
последний аргумент становится возвратом функции, что позволяет безопасно 
оборачивать в `E.v()` любое значение.

Например есть функция и её вызов:

    const random = x => Math.floor(Math.random() * x) + 10;
    random(1);

Можно обернуть в `E.v()` любое значение в выражении:

    const random = x => Math.floor(E.v(Math.random()) * x) + 10;
    random(1); //=> V: [ 0.504418952113608 ]

Можно добавить к распечатке любые другие значения:

    const random = x => Math.floor(E.v(x, this, "mystr", Math.random()) * x) + 10;
    random(1); //=> V: [ 1, {}, 'mystr', 0.8474771121023132 ]

Это может быть особенно полезно, если в коде расставлено одновременно сразу 
несколько watcher'ов и нужно как-то различать их выводы:

    const fn = x => x > 0 ? E.v(x * 1.25) : E.v(x / 9);

Тогда можно передавать первым аргументом какой-нибудь маркер, например строку.

    const fn = x => x > 0 ? E.v("positive", x * 1.25) : E.v("negative", x / 9);
    fn(5);   //=> V: [ 'positive', 6.25 ]
    fn(-81); //=> V: [ 'negative', -9 ]

Но обычно проще использовать в качестве маркеров просто цифры:

    const fn = x => x > 0 ? E.v(0, x * 1.25) : E.v(1, x / 9);
    fn(5);   //=> V: [ 0, 6.25 ]
    fn(-81); //=> V: [ 1, -9 ]


Watching a Function
-------------------
Утилита `E.f()` ("f" означает "function") предназначена для слежения за 
функцией. Она полезна, если нужно не просто разово распечатать значение, а 
распечатывать аргументы и возврат функции каждый раз, когда она вызывается. 
Если функция выбросит исключение, то оно также будет распечатано, а затем 
выброшено снова. После того как функция обёрнута в `E.f()`, её можно безопасно 
использовать как и раньше, все аргументы и возврат будут беспрепятственно 
проксироваться.

Допустим, есть код:

    const transform = x => 2 * x;
    const arr = [1, 2, 3];
    const result = arr.map(transform);

Можно обернуть в `E.f()` функцию, чтобы получить новую, которая будет 
действовать точно также, но при этом будет сообщать информацию о своих вызовах:

    const result = arr.map(E.f(transform));

    //=> F: []
    //=> F Params: [1, 0, [1,2,3]]
    //=> F Result: 2

    //=> F: []
    //=> F Params: [2, 1, [1,2,3]]
    //=> F Result: 4

    //=> F: []
    //=> F Params: [3, 2, [1,2,3]]
    //=> F Result: 6

Как и `E.v()`, утилита `E.f()` может принимать на распечатку дополнительно 
любые другие значения, которые будут распечатываться вместе с информацией о 
вызове функции. Но последний аргумент должен быть непременно функцией, которую 
требуется отслеживать и которая вернёт результат вызова.

    const myvar = true;
    const result = arr.map(E.f(1, "mystr", myvar, transform));

    //=> F: [1, "mystr", true]
    //=> F Params: [1, 0, [1,2,3]]
    //=> F Result: 2

    //=> F: [1, "mystr", true]
    //=> F Params: [2, 1, [1,2,3]]
    //=> F Result: 4

    //=> F: [1, "mystr", true]
    //=> F Params: [3, 2, [1,2,3]]
    //=> F Result: 6


Watching a Method
-----------------
Утилита `E.m()` ("m" означает "method") похожа на `E.f()`, но дополнительно 
позволяет проксировать внутрь "this", а значит может быть применена к методу, 
который непременно нуждается в корректном "this". `E.f()` в такой ситуации 
привела бы к ошибке.

Если есть вызов метода:

    o1.o2.o3.method(5)

То нужно разбить это выражение на два: объект и строка, содержащая путь в 
объекте до метода. Например следующие вызовы дают один и тот же результат:

    E.m(o1,".o2.o3.method")(5);
    E.m(o1.o2,".o3.method")(5);
    E.m(o1.o2.o3,".method")(5);

В остальном утилита действует аналогично `E.f()`.


Quiet Mode
----------
Для всех утилит наблюдения за значениями (`E.v()`, `E.f()`, `E.m()`), а также 
их условных аналогов (`E.mb.v()`, `E.mb.f()`, `E.mb.m()`) существуют 
модифицированные версии с тем же именем, но в верхнем регистре (`E.V()`, 
`E.F()`, `E.M()`, `E.mb.V()`, `E.mb.F()`, `E.mb.M()`). Они делают тоже самое, 
но не распечатывают последний принятый аргумент. То есть они не для того чтобы 
распечатать исходное обернутое значение, а для того чтобы распечатать 
дополнительные переданные аргументы. Это полезно, если вам плевать на то как 
вызывается функция и какой у неё возврат. Важно просто узнать вызывается она 
или нет.

Например, если есть:

    const fn = x = > x + 1;
    fn();

И приходилось это заменять на:

    const fn = x => {
        console.log("Invoked!");
        return x + 1;
    };
    fn(); //=> Invoked!

То теперь достаточно написать:

    const fn = E.F("Invoked!", x = > x + 1);
    fn(); //=> [ 'Invoked!' ]

Или так:

    const fn = x = > x + 1;
    E.F("Invoked!", fn)(); //=> [ 'Invoked!' ]


Breakpoint Mode
---------------
Для всех утилит наблюдения за значениями (`E.v()`, `E.f()`, `E.m()`), а также 
их условных аналогов (`E.mb.v()`, `E.mb.f()`, `E.mb.m()`) существуют 
модифицированные версии, заканчивающиеся на знак подчёркивания (`E.v_()`, 
`E.f_()`, `E.m_()`, `E.mb.v_()`, `E.mb.f_()`, `E.mb.m_()`). Вместо того, чтобы 
выводить информацию в консоль, они создают точку останова с помощью инструкции 
"debugger", чтобы из отладчика можно было осмотреться и пройти вверх по стеку 
вызовов. По задумке, символ подчёркивания символизирует то, что в этом месте 
выполнение программы приостанавливается.


Conditional Watchers
--------------------
Допустим есть js-модуль и unit-тесты для него. Не пройден один из 30 тестов и, 
чтобы понять причину, требуется распечатать значение где-то очень глубоко в 
модуле, которое много раз в нём вычисляется в каждом тесте. Если распечатывать 
его для каждого из тестов, то в консоли получится несколько сотен значений, в 
которых будет очень сложно найти нужные. Чтобы этого избежать, надо 
использовать условные аналоги утилит, которые располагаются в объекте `E.mb` 
("mb" значит "maybe"). По умолчанию эти аналоги (`E.mb.v()`, `E.mb.f()`, 
`E.mb.m()`, `E.mb.V()`, `E.mb.F()`, `E.mb.M()`, `E.mb.v_()`, `E.mb.f_()`, 
`E.mb.m_()`) никак себя не проявляют. Чтобы они вывели в консоль данные или 
создали останов, их надо специальным образом "включить".

Допустим есть модуль и тест для него:

    // module.js
    function action(x) {
        // ... большая функция со сложной логикой.
        const y = x * 8;
        return y ^ Math.PI;
    }

    // module.spec.js
    describe("action()", () => {
        // ... десяток других тестов для функции action()
        it("should perform a complex calculation", () => {
            const res = action(2);
            expect(res).toBe(16);
        });
    });

Для начала нужно обернуть желаемое выражение в вызов условной утилиты из 
`E.mb`:

    // module.js
    function action(x) {
        ...
        return E.mb.v(y) ^ Math.PI;
    }

Далее перед тем как вычислять это выражение нужно где-то "включить" условную 
утилиту. Это можно сделать вручную, выставив флаг `E.enabled`:

    E.enabled = true;
    const res = action(2);
    E.enabled = false;

Поскольку echolot — функциональная библиотека, то существуют функции, которые 
делают то же самое:

    E.deb();
    const res = action(2);
    E.off();

Если требуется включить условную отладку для вызова некоторой функции, то на 
этот случай существует специальная утилита:

    const res = E.debF(action)(2);

Есть также утилита на случай, если надо обернуть любое выражение или набор 
инструкций. Однако, эта утилита — кандидат на удаление в будущих версиях.

    const res = E.debV(() => action(2));
        // Включает отладку для выражения action(2)


Shorthands
----------
Чтобы не тратить время на расстановку скобок вокруг интересующего выражения, 
можно вызывать утилиты как методы любого объекта. Например вместо утомительной 
расстановки скобок:

    this.error = E.f("myerr", dataUtil.ngError)(e.data);

Можно сделать правку в единственном месте:

    this.error = dataUtil.ngError.E.f("myerr")(e.data);

Чтобы это работало, надо инициализировать echolot специальным образом:

    window.E = echolot.inject("E"); // In browser
    global.E = require("echolot").inject("E"); // In Node.js

`inject()` добавит в прототип Object альтернативные методы и вернёт обычный 
набор функций, которые экспортирует библиотека. В качестве аргумента 
принимается имя, которое будет добавлено в прототип. Оно добавляется с флагом 
`enumerable: false`, чтобы не ломать существующий код.

Существующие альтернативные реализации утилит:

    E.v(name)  <=> name.E.v()
    E.f(func)  <=> func.E.f()
    E.V(name)  <=> name.E.V()
    E.F(func)  <=> func.E.F()
    E._v(name) <=> name.E._v()
    E._f(func) <=> func.E._f()

    E.mb.v(name)  <=> name.E.mb.v()
    E.mb.f(func)  <=> func.E.mb.f()
    E.mb.V(name)  <=> name.E.mb.V()
    E.mb.F(func)  <=> func.E.mb.F()
    E.mb._v(name) <=> name.E.mb._v()
    E.mb._f(func) <=> func.E.mb._f()

Следует быть осторожным с `null` и `undefined`, так как они не приводятся к 
объекту, а значит попытка обратиться к их методам вызовет TypeError.


Options
-------
E.conf — объект с опциями.

### print
    print :: (a, b, c, ...) -> String

Это функция, используемая для вывода данных. По умолчанию: `console.log`

### format
    format :: Boolean

Форматировать ли текст для Node.js. Будет использован нодный пакет "util". 
Выставляется по умолчанию, если в глобальной области видимости обнаружена 
нодная модульная система.

* * *

Следующие опции форматирования, актуальны, если `E.conf.format === true`

### enumerable
    enumerable :: Boolean

Распечатывать ли не перечисляемые поля объектов. По умолчанию: `false`

### depth
    depth :: Number

Глубина, на которую распечатывать объекты. `Infinity` — распечатывать 
содержимое на любой глубине. По умолчанию: `2`

### color
    color :: Boolean

Разукрашивать ли распечатанные значения.
Выставляется автоматически, если stdout соединён с терминалом.