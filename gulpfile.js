//gulp4以降では下記の記述が必要
var sass = require("gulp-sass")(require("sass"));
//ベンダーフレックスをつける
var autoprefixer = require("gulp-autoprefixer");
//css圧縮
var cssmin = require("gulp-cssmin");

//gulp
const gulp = require("gulp");
//画像圧縮
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");

// scssのファイルパス指定を定義
const path = {
  src: "./scss/*.scss",
  dist: "./css/",
};

// default のタスクを作成する
gulp.task("default", function () {
  return gulp.watch(path.src, function () {
    // ●●.scssファイルを取得
    return (
      gulp
        .src(path.src)
        // Sassのコンパイルを実行、error以降Sassのコンパイルエラーを表示(これがないと自動的に止まってしまう)
        .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
        .pipe(autoprefixer())
        // cssフォルダー以下に掃き出し
        .pipe(gulp.dest(path.dist))
    );
  });
});

gulp.task("img", function (done) {
  gulp
    .src("dist/*.{jpg,jpeg,png,gif,svg}")
    .pipe(
      imagemin([
        pngquant({
          quality: [0.6, 0.7], // 画質
          speed: 1, // スピード
        }),
        mozjpeg({ quality: 65 }), // 画質
        imagemin.svgo(),
        imagemin.optipng(),
        imagemin.gifsicle({ optimizationLevel: 3 }), // 圧縮率
      ])
    )
    .pipe(gulp.dest("img"));
  done();
});
