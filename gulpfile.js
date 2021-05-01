//let project_folder = "dist";                                 // папка которая создается после сборки
let project_folder = require("path").basename(__dirname)   // папка которая создается будет называться как проект
let source_folder = "#Source";                               // папка с исходниками

// для автоматического подключения шрифтов
let fs = require('fs');

// пути куда gulp будет выгружать готовые файлы и пути к исходникам
let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
        //css: source_folder + "/scss/style.scss",
        css: [source_folder + "/scss/style.scss", source_folder + "/scss/iconfontAwesome.css"],
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    // файлы которые необходимо прослушивать
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    },
    // объект который будет отвечать за удаление готовой рабочей папки перед очередной сборкой
    clean: "./" + project_folder + "/"
}

// переменные в которые будет занесён сам gulp
let {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),               // переменная для плагина browser-sync
    fileinclude = require("gulp-file-include"),                   // переменная для плагина gulp-file-include
    del = require("del"),                                         // переменная для пдагина del
    scss = require("gulp-sass"),                                  // переменная для пдагина gulp-sass
    autoprefixer = require("gulp-autoprefixer"),                  // переменная для пдагина gulp-autoprefixer........
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    webphtml = require("gulp-webp-html"),
    webpcss = require("gulp-webpcss"),
    svgSprite = require("gulp-svg-sprite"),
    ttf2woff = require("gulp-ttf2woff"),
    ttf2woff2 = require("gulp-ttf2woff2"),
    fonter = require("gulp-fonter");


// функция для обновления страницы
function browserSync(params) {
    browsersync.init({
        // настроим сервер
        server: {
            baseDir: "./" + project_folder + "/",                // базавая папка
            port: 3003,
            notify: false                                        // отключение оповещения об обновлении страницы
        }
    })
}

// функция работы с html файлами
function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))         // pipe() функция в которой мы пишем команды для gulp
        .pipe(browsersync.stream())          // обновить страницу
}

// функция работы с scss файлами
function css() {
    return src(path.src.css)
        .pipe(
            // настройки
            scss({
                outputStyle: "expanded"                  // вывод файла в несжатом виде
            })
        )
        .pipe(group_media())
        .pipe(webpcss())
        .pipe(dest(path.build.css))                      // выгрузка несжатого файла
        .pipe(clean_css())                               // сжимаем, переименовываем и выгружаем
        .pipe(
            rename({
                extname: ".min.css"
            })
        )
        .pipe(
            autoprefixer({
                overrideBrowserslist: ['last 5 versions'],
                cascade: true
            })
        )
        .pipe(dest(path.build.css))         // pipe() функция в которой мы пишем команды для gulp
        .pipe(browsersync.stream())          // обновить страницу
}

// функция работы с js файлами
function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))         // pipe() функция в которой мы пишем команды для gulp
        .pipe(browsersync.stream())          // обновить страницу
}

// функция работы с картинками
function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                interlaced: true,
                optimizationLevel: 3                          // от 0 до 7
            })
        )
        .pipe(dest(path.build.img))         // pipe() функция в которой мы пишем команды для gulp
        .pipe(browsersync.stream())         // обновить страницу
}

// функция для обработки шрифтов
function fonts() {
    src(path.src.fonts)
        .pipe(ttf2woff())
        .pipe(dest(path.build.fonts))  // выгрузка
    return src(path.src.fonts)
        .pipe(ttf2woff2())
        .pipe(dest(path.build.fonts))  // выгрузка
}

// отдельная задача для переделки .otf шрифтов (запускается в отдельном терминале, параллельно с gulp)
gulp.task('otf2ttf', function (){
    return src([source_folder + '/fonts/*.otf'])
        .pipe(fonter({
            formats: ['ttf']
        }))
        .pipe(dest(source_folder + '/fonts/'))
})

// работа со спрайтами ( эта функция вызывается отдельно в терминале )
gulp.task('svgSprite', function () {
    return gulp.src([source_folder + '/iconsprite/*.svg'])
        // обработчик
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../icons/icons.svg",    // имя исходного файла
                    example: true                   // создает html файл с примерами иконок
                }
            },
        }))
        .pipe(dest(path.build.img))
})

// подключение готовых шрифтов к файлу стилей
function fontsStyle(params) {
    let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
    if (file_content == '') {
        fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
        return fs.readdir(path.build.fonts, function (err, items) {
            if (items) {
                let c_fontname;
                for (var i = 0; i < items.length; i++) {
                    let fontname = items[i].split('.');
                    fontname = fontname[0];
                    if (c_fontname != fontname) {
                        fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname + '", "400", "normal");\r\n', cb);
                    }
                    c_fontname = fontname;
                }
            }
        })
    }
}


// функция callback
function cb(){

}


// функция прослушивания изменений
function watchFiles(params) {
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

// функция для автоматического удаления папки
function clean(params) {
    return del(path.clean);
}


// серии выполняемых функций
let build = gulp.series(clean, gulp.parallel(images, fonts, js, css, html), fontsStyle);
let watch = gulp.parallel(build, watchFiles, browserSync);    // паралельное выполнение

// необходимо "подружить" переменные с gulp

exports.fontsStyle = fontsStyle;
exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;




















