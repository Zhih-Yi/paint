class Paint {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = '#9BFFCD';
        this.lineWidth = 10;
        this.lineJoin = "round";
        this.lineCap = "round";
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.isDrawing = false;
        this.lastX = 0;
        this.lastY = 0;
        this.hue = 0;
        this.step = -1;
        this.historyArr = [];
    }

    clearAll() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    redo() {
        if (this.step < this.historyArr.length - 1) {
            this.step++;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
                this.clearAll();
                this.ctx.drawImage(canvasImg, 0, 0, this.canvas.width, this.canvas.height);

            })
        }
    }
    undo() {
        if (this.step > 0) {
            this.step--;
            let canvasImg = new Image();
            canvasImg.src = this.historyArr[this.step];
            canvasImg.addEventListener('load', e => {
                this.clearAll();
                this.ctx.drawImage(canvasImg, 0, 0, this.canvas.width, this.canvas.height);

            })
        }
    }

    displayImg() {
        let image = new Image();
        let upload = document.getElementById('filetag');
        //toimage
        if (upload.files && upload.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {

                image.setAttribute("src", e.target.result);

            };

            reader.readAsDataURL(upload.files[0]);
        }
        //draw image on canvas
        image.addEventListener('load', e => {

            this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);

        });
    }
    //儲存成圖片匯出
    save() {
        var download = document.querySelector('.save');
        var image = this.canvas.toDataURL();
        download.setAttribute("href", image);

    }

    changeStroke() {
        let strokeWidth = document.querySelector('.stroke').value;
        if (isNaN(strokeWidth)) return;
        this.lineWidth = strokeWidth;
    }
    changeColor() {

        let setcolorEL = document.querySelector('#setcolor');

        if (setcolorEL.checked === true) {
            this.color = document.querySelector('#colorset').value;

        } else {
            let colorBtn = document.querySelector('input[name=color]:checked');
            let colorName = colorBtn.getAttribute('id');
            switch (colorName) {
                case 'green':
                    this.color = '#01936F';
                    break;
                case 'light-green':
                    this.color = '#00CC99';
                    break;
                case 'light-blue':
                    this.color = '#9BFFCD';
                    break;
                case 'black':
                    this.color = '#000000';
                    break;
                case 'white':
                    this.color = '#ffffff';
                    break;
                case 'colorall':
                    this.color = 'colorall';
                    break;

            }
        }


    }

    startDrawing(e) {

        if (!this.isDrawing) return;


        if (this.color === "colorall") {
            this.ctx.strokeStyle = `hsl(${this.hue},100%,50%)`;
            this.hue++;
        } else {
            this.ctx.strokeStyle = this.color;
        }

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.offsetX * this.canvas.width / this.canvas.clientWidth | 0,
            e.offsetY * this.canvas.height / this.canvas.clientHeight | 0);
        this.ctx.lineJoin = this.lineJoin;
        this.ctx.lineCap = this.lineCap;

        this.ctx.stroke();
        this.lastX = e.offsetX * this.canvas.width / this.canvas.clientWidth | 0;
        this.lastY = e.offsetY * this.canvas.height / this.canvas.clientHeight | 0;


    }

    SaveHistory() {
        //紀錄
        this.step++;
        this.historyArr.push(this.canvas.toDataURL());
    }
}
let canvas = document.querySelector(".canvas");
let ctx = canvas.getContext("2d");
window.onload = function () {

    let painting = new Paint(canvas, ctx);
    //upload img function
    let upload = document.getElementById('filetag');
    document.querySelector('.file-upload').addEventListener('click', function () {
        upload.click();
    });
    upload.addEventListener('change', function (e) {
        painting.displayImg();
    });
    //default color
    document.querySelector('#light-blue').checked = true;
    //set mouse down event
    painting.canvas.addEventListener("mousemove", (e) => {
        painting.changeColor();
        painting.changeStroke();
        painting.startDrawing(e);

    });
    painting.canvas.addEventListener("mousedown", (e) => {
        painting.isDrawing = true;
        painting.lastX = e.offsetX * painting.canvas.width / painting.canvas.clientWidth | 0;
        painting.lastY = e.offsetY * painting.canvas.height / painting.canvas.clientHeight | 0;
        if (painting.historyArr.length < 1) {
            painting.SaveHistory();
        }

    });
    painting.canvas.addEventListener("mouseup", () => {
        painting.isDrawing = false;
        painting.SaveHistory();
    });
    painting.canvas.addEventListener("mouseout", () => painting.isDrawing = false);
    //clear alll btn
    document.querySelector('.clear').addEventListener("click", () => painting.clearAll())
    //undo 
    document.querySelector('.undo').addEventListener("click", () => painting.undo()
    );
    //redo
    document.querySelector('.redo').addEventListener("click", () => painting.redo()
    );
    //download
    document.querySelector('.save').addEventListener("click", () => painting.save());

    //fold toolbox
    var toolboxfold = document.querySelector('#collapseBottom')
    toolboxfold.addEventListener('hide.bs.collapse', function () {
        document.querySelector('.btn-circle-top').innerHTML = ' <i class="fas fa-paint-brush"></i>';
    })

}

