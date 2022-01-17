var Engine = Matter.Engine, //物理シュミレーションおよびレンダリングを管理するコントローラーとなるメソッド
  World = Matter.World, //物理演算領域の作成・操作するメソッドを含む
  Body = Matter.Body, //剛体のモデルを作成・操作するメソッドを含む
  Bodies = Matter.Bodies, //一般的な剛体モデルを作成するメソッドを含む
  Constraint = Matter.Constraint, //制約を作成・操作するメソッドを含む
  Composites = Matter.Composites,
  Common = Matter.Common,
  Vertices = Matter.Vertices, //頂点のセットを作成・操作するメソッドを含む
  MouseConstraint = Matter.MouseConstraint; //マウスの制約を作成するためのメソッドが含む

//gauge-containerの高さを取得
let gaugeContainerHeight =
  document.getElementById("gauge-container").clientHeight;

let width = window.innerWidth; //windowの幅
let height = document.body.offsetHeight - gaugeContainerHeight; //windowの高さからフッターの高さをひく
let items = 7; //itemの数

// Matter.jsのEngineを作成
var container = document.getElementById("canvas-container");
var engine = Engine.create(container, {
  render: {
    //レンダリングの設定
    options: {
      wireframes: false, //ワイヤーフレームモードをoff
      width: width, //canvasのwidth(横幅)
      height: height, //canvasのheight(高さ)
      background: "rgba(0, 0, 0, 0)", //白
    },
  },
});

//マウス操作
var mouseConstraint = MouseConstraint.create(engine, {
  element: container, //マウス操作を感知する要素を指定（DEMOでは生成したcanvasを指定）
  constraint: {
    render: {
      strokeStyle: "rgba(0, 0, 0, 0)", //マウス操作の表示を隠す
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

World.add(engine.world, mouseConstraint);

//床を作る
World.add(engine.world, [
  Bodies.rectangle(0, height, width * 2, 1, {
    isStatic: true, //固定する
    render: {
      fillStyle: "#", // 塗りつぶす色: CSSの記述法で指定
      strokeStyle: "rgba(0, 0, 0, 0)", // 線の色: CSSの記述法で指定
      lineWidth: 0,
    },
  }),
]);

//ランダムな値を作る
let getRandomParameter = (max, min) => {
  return Math.floor(Math.random() * (max + 1 - min)) + min;
};

//物体を追加する
for (var i = 0; i < items; i++) {
  var rnd = parseInt(Math.random() * width);
  var x = getRandomParameter(width, 0);
  var y = getRandomParameter(-1000, -500);
  World.add(engine.world, [
    Bodies.rectangle(x, y, 100, 145, {
      // density: 0.0005, // 密度: 単位面積あたりの質量
      // frictionAir: 0.06, // 空気抵抗(空気摩擦)
      restitution: 0.8, // 弾力性
      // friction: 0.01, // 本体の摩擦
      //長方形を追加する
      render: {
        sprite: {
          //スプライトの設定
          texture: "./img/7.png", //スプライトに使うテクスチャ画像を指定
        },
      },
    }),
  ]);
}

const canvasContainer = document.querySelector("#canvas-cover");

const bar = document.querySelectorAll("#prog-bar > .progress-bar")[0];
const up = document.getElementById("up");
const refresh = document.querySelector("#refresh");
const pressGauge = document.getElementById("press-gauge");
let gauge = 0;

//連打ボタンの処理
up.onclick = () => {
  if (gauge < 100) {
    gauge = gauge + 17;
    bar.style.width = gauge + "%";
  } else {
    console.log("7をふらす");
    Matter.Runner.run(engine);
    // Engine.run(engine);//7をふらす処理
    up.classList.add("button-disabled");
    refresh.classList.remove("button-disabled");
    up.disabled = true;
  }
  console.log(gauge);
};

//クリックしないとゲージを減らず
const downGauge = function () {
  if (gauge < 100 && gauge > 0) {
    gauge = gauge - 6; //3%減らす
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

//リフレッシュボタン
refresh.onclick = () => {
  // canvasContainer.classList.add("is-remove");
  // canvasContainer.classList.remove("is-active");
  up.classList.remove("button-disabled");
  bar.style.width = 0 + "%";
  gauge = 0;
  up.disabled = false;
  Matter.Engine.clear(engine);
};
