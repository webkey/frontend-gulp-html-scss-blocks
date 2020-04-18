# Project Template
## Start Project
### Installing Modules
```
npm i
```
## Run Project
### Develop with Change Tracking
```
npm start
```
### Production
**Optimization images, minification css and js, remove css.maps**
```
npm run production
```
### Remove dist folder
```
npm run clean
```
### Clear cache
```
npm run clear
```
### Start lint
```
npm run lint
```
## Project structure
```
├── app/                              # Develop folder
│   ├── blocks/                       # Logical blocks
│   │   └── block/                    # Logical block
│   │       ├── block.html            # Block template
│   │       ├── block.js              # Block scripts
│   │       └── block.scss            # Block styles
│   ├── favicons/                     # Favicons
│   ├── images/                       # Images
│   ├── includes/                     # Files that are not copied to "dist"
│   │   └── svg/                      # SVG icons that are for direct addition to HTML
│   ├── resources/                    # Static files to copy to "dist". Such as fonts, media, downloads etc.
│   ├── scripts/                      # Scripts
│   │   ├── common.js                 # Common scripts
│   │   └── app.js                    # Main scripts
│   ├── styles/                       # Styles
│   │   ├── common/                   # Common styles
│   │   │   ├── common.scss           # Common
│   │   │   ├── fonts.scss            # Fonts
│   │   │   ├── footer-at-bottom.scss # Press footer to bottom of page
│   │   │   ├── helper-classes.scss   # Helper classes
│   │   │   ├── no-js.scss            # No js note
│   │   │   ├── normalize.scss        # Normalize
│   │   │   ├── old-ie.scss           # Old IE note
│   │   │   └── mixins.scss           # Mixines
│   │   ├── print/                    # Print styles
│   │   │   └── print.scss            # Print
│   │   ├── utils/                    # Units
│   │   │   ├── _functions.scss       # Functions
│   │   │   ├── _mixins.scss          # Mixines
│   │   │   └── _variables.scss       # Variables
│   │   └── app.min.scss              # Main styles
│   └── some.html                     # Html page
├── .eslintrc                         # Конфигурация проверки JavaScript в ESLint
├── .stylelintrc                      # Конфигурация проверки SCSS в StyleLint
├── .editorconfig                     # Конфигурация настроек редактора кода
├── .gitignore                        # Список исключённых файлов из Git
├── browserlist                       # Список версий браузеров для Autoprefixer
├── gulpfile.babel.js                 # Файл для запуска Gulp.js
├── make-block.js                     # Утилита создания новых блоков
├── libs-links.js                     # Пути к сторонним библиотекам
├── package.json                      # Список модулей и прочей информации
└── readme.md                         # Документация шаблона
```