// Matter.js - http://brm.io/matter-js/
var Engine = Matter.Engine, //物理シュミレーションおよびレンダリングを管理するコントローラーとなるメソッド
  World = Matter.World, //物理演算領域の作成・操作するメソッドを含む
  Body = Matter.Body, //剛体のモデルを作成・操作するメソッドを含む
  Bodies = Matter.Bodies, //一般的な剛体モデルを作成するメソッドを含む
  Constraint = Matter.Constraint, //制約を作成・操作するメソッドを含む
  Composites = Matter.Composites,
  Common = Matter.Common,
  Vertices = Matter.Vertices, //頂点のセットを作成・操作するメソッドを含む
  MouseConstraint = Matter.MouseConstraint; //マウスの制約を作成するためのメソッドが含む
// create engine
const engine = Matter.Engine.create();
const world = engine.world;

//gauge-containerの高さを取得
let gaugeContainerHeight =
  document.getElementById("gauge-container").clientHeight;

let width = window.innerWidth; //windowの幅
let height = document.body.offsetHeight - gaugeContainerHeight; //windowの高さからフッターの高さをひく
let items = 7; //itemの数
var container = document.getElementById("canvas-container");
const up_wrap = document.querySelector(".up__cover");
// create renderer
const render = Matter.Render.create({
  element: container,
  engine: engine,
  options: {
    wireframes: false, //ワイヤーフレームモードをoff
    width: width, //canvasのwidth(横幅)
    height: height, //canvasのheight(高さ)
    background: "rgba(0, 0, 0, 0)", //白
  },
});

// create runner
const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);

// add mouse control
const mouse = Matter.Mouse.create(render.canvas);
const mouseConstraint = Matter.MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
      visible: false,
    },
  },
});

mouseConstraint.mouse.element.removeEventListener(
  "mousewheel",
  mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
  "DOMMouseScroll",
  mouseConstraint.mouse.mousewheel
);

let touchStart;
mouseConstraint.mouse.element.addEventListener("touchstart", (event) => {
  if (!mouseConstraint.body) {
    touchStart = event;
  }
});

mouseConstraint.mouse.element.addEventListener("touchend", (event) => {
  if (!mouseConstraint.body) {
    const startY = touchStart.changedTouches[0].clientY;
    const endY = event.changedTouches[0].clientY;
    const delta = Math.abs(startY - endY);

    if (delta > 80) {
      window.scrollTo(0, 600);
    }
  }
});

// keep the mouse in sync with rendering
render.mouse = mouse;

// 初期化
const init = () => {
  // 削除
  Matter.Composite.clear(world);
  up.classList.remove("button-disabled");
  up_wrap.classList.remove("is-active");

  bar.style.width = 0 + "%";
  gauge = 0;
  up.disabled = false;
  Matter.Composite.clear(world);
  // 床
  Matter.Composite.add(world, [
    Matter.Bodies.rectangle(0, height, width * 2, 1, {
      isStatic: true,
      render: {
        fillStyle: "#", // 塗りつぶす色: CSSの記述法で指定
        strokeStyle: "rgba(0, 0, 0, 0)", // 線の色: CSSの記述法で指定
        lineWidth: 0,
      },
    }),
  ]);
  //マウス操作を登録
  Matter.Composite.add(world, mouseConstraint);
};

//ランダムな値を作る
let getRandomParameter = (max, min) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

const canvasContainer = document.querySelector("#canvas-cover");

const bar = document.querySelectorAll("#prog-bar > .progress-bar")[0];
const up = document.getElementById("up");
const refresh = document.querySelector("#refresh");
const pressGauge = document.getElementById("press-gauge");

let gauge = 0;

// 追加
const add = () => {
  if (gauge < 100) {
    gauge = gauge + 15;
    bar.style.width = gauge + "%";
  } else {
    Matter.Render.run(render);
    console.log("7をふらす");
    up.classList.add("button-disabled");
    refresh.classList.remove("button-disabled");
    up_wrap.classList.add("is-active");
    // up.remove();
    up.disabled = true;
    for (let i = 0; i < items; i++) {
      let x = getRandomParameter(width, 0);
      let y = getRandomParameter(-1000, -500);
      Matter.Composite.add(world, [
        Matter.Bodies.rectangle(x, y, 100, 145, {
          restitution: 0.6,
          render: {
            sprite: {
              //スプライトの設定
              texture: "./img/7.png", //スプライトに使うテクスチャ画像を指定
            },
          },
        }),
      ]);
    }
  }
  console.log(gauge);
};

//クリックしないとゲージを減らず
const downGauge = function () {
  if (gauge < 100 && gauge > 0) {
    gauge = gauge - 8; //3%減らす
    bar.style.width = gauge + "%";
    pressGauge.innerHTML = gauge;
  }
  if (gauge > 100) {
    pressGauge.innerHTML = 100; //100を超えたら100を代入
  }
  if (gauge < 0) {
    pressGauge.innerHTML = 0; //0以下は0を代入
  }
};

//0.1秒ごとに関数downGaugeを実行
let time = 100;
const downTime = setInterval(downGauge, time);
const $add = document.getElementById("up");
$add.addEventListener("click", add);
function no_scaling() {
  document.addEventListener("touchmove", mobile_no_scroll, { passive: false });
}
// クリア
const $clear = document.getElementById("refresh");
$clear.addEventListener("click", init);

// 初期化
init();
