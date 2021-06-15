var sketchProc = function(processingInstance) {
  with (processingInstance) {
    size(600, 600); 
    frameRate(60);

    var scene;

    //used for the leg cycling action (knee point)
    //gets unknown point from two known points and three known lengths (thanks jent)
    var getPoint = function(Ax, Ay, Bx, By, b, c) {
        var t = atan2(By - Ay, Bx - Ax);
        var a = dist(Ax, Ay, Bx, By);
        var f = acos(((Bx - Ax) * (Bx - Ax) + (By - Ay) * (By - Ay) + c * c - b * b) / (2 * a * b));
        var Cx = Ax + cos(t - f) * c,
            Cy = Ay + sin(t - f) * c;

        return {x: Cx, y: Cy};
    };
    var SteamSystem = function() {
        this.steamArr = [];
        this.add = function() {
            this.steamArr.push({
                x: random(240, 355),
                y: 300,
                diameter: random(10, 25),
                vx: random(-2, -0.5),
                vy: random(-4, -1.5),
                opacity: random(200, 250),
                fade: random(3, 5)
            });
        };
        this.run = function() {
            if(frameCount % 20 === 0) {
                this.add();
            }

            noStroke();

            for(var i = this.steamArr.length - 1; i >= 0; i--) {
                var s = this.steamArr[i];

                fill(88, 51, 50, s.opacity);

                ellipse(s.x, s.y, s.diameter, s.diameter);

                s.x+= s.vx;
                s.y+= s.vy;

                if(s.y < 250) {
                    s.vx-= 0.025;
                }

                s.opacity-= s.fade;
                if(s.opacity <= 0) {
                    this.steamArr.splice(i, 1);
                }
            }
        };
    };
    var GroundSystem = function(speed) {
        this.groundArr = [];
        this.add = function() {
            this.groundArr.push({
                x: random(650, 750),
                y: random(470, 600),
                diameter: random(10, 25),
                vx: speed,
                opacity: random(100, 150)
            });
        };
        this.run = function() {
            if(frameCount % 20 === 0) {
                this.add();
            }

            noStroke();

            for(var i = this.groundArr.length - 1; i >= 0; i--) {
                var s = this.groundArr[i];

                fill(100, s.opacity);

                ellipse(s.x, s.y, s.diameter, s.diameter * 0.3);

                s.x-= s.vx;

                if(s.x + s.w / 2 < 0) {
                    this.groundArr.splice(i, 1);
                }
            }
        };
    };
    var MountainSystem = function(speed) {
        this.triangles = [];
        this.speed = speed * 0.5;

        this.init = function() {
            for(var i = 0; i < 6; i++) {
                this.triangles.push({
                    x: i * width / 5,
                    y: 450,
                    w: width / 5,
                    h: ~~random(50, 190)
                });
            }
        };
        this.init();
        this.run = function() {
            //mountains (triangles)
            fill(100);
            noStroke();
            //loop through each of the triangles in the triangles array
            for(var i = 0; i < this.triangles.length; i++) {
                //move each triangle at the same speed as the wheels
                this.triangles[i].x-= this.speed;

                //draw the triangles
                triangle(   this.triangles[i].x, 
                            this.triangles[i].y, 
                            this.triangles[i].x + this.triangles[i].w, 
                            this.triangles[i].y, 
                            this.triangles[i].x + this.triangles[i].w / 2, 
                            this.triangles[i].y - this.triangles[i].h);

                //if a triangle goes off the screen then reset it
                //back to the width of the screen with a new random height
                if(this.triangles[i].x + this.triangles[i].w <= 0) {
                    this.triangles[i].x = width;
                    this.triangles[i].h = ~~random(50, 190);
                }
            }
        };
    };
    var FrontWheel = function(speed) {
        this.speed = speed;
        this.circumference = 2 * PI * 90;
        this.angle = 0;

        this.get = function() {
            background(0, 0, 0, 0);

            //front
            noFill();
            stroke(88, 51, 50);
            strokeWeight(50);
            ellipse(425, 458, 90, 90);

            stroke(247, 197, 150);
            strokeWeight(25);
            ellipse(425, 458, 65, 65);

            noStroke();
            fill(247, 197, 150);
            beginShape();
                vertex(405, 408);
                bezierVertex(418, 401, 430, 401, 439, 402);
                bezierVertex(446, 407, 458, 412, 469, 420);
                bezierVertex(477, 428, 478, 437, 482, 446);
                bezierVertex(482, 459, 481, 473, 479, 486);
                bezierVertex(475, 493, 466, 498, 461, 504);
                bezierVertex(447, 509, 437, 514, 425, 515);
                bezierVertex(412, 512, 409, 511, 399, 511);
                bezierVertex(389, 501, 382, 492, 375, 481);
                bezierVertex(370, 471, 366, 460, 368, 447);
                bezierVertex(373, 436, 384, 421, 407, 407);
                bezierVertex(451, 409, 406, 418, 398, 426);
                bezierVertex(388, 454, 391, 480, 408, 496);
                bezierVertex(439, 496, 461, 474, 463, 444);
                bezierVertex(453, 425, 433, 415, 413, 412);
            endShape(CLOSE);

            //swirl
            noStroke();
            fill(245, 148, 148);

            beginShape();
                vertex(438, 474);
                bezierVertex(442, 485, 451, 488, 459, 487);
                bezierVertex(464, 484, 468, 476, 460, 463);
                bezierVertex(453, 451, 445, 443, 435, 432);
                bezierVertex(422, 418, 416, 410, 410, 405);
                bezierVertex(408, 400, 410, 395, 418, 397);
                bezierVertex(425, 402, 433, 411, 444, 424);
                bezierVertex(454, 435, 465, 451, 473, 463);
                bezierVertex(479, 471, 479, 483, 471, 496);
                bezierVertex(459, 500, 446, 499, 440, 496);
                bezierVertex(431, 490, 431, 488, 426, 478);
            endShape(CLOSE);

            beginShape();
                vertex(408, 446);
                bezierVertex(394, 435, 382, 429, 371, 432);
                bezierVertex(367, 432, 363, 444, 366, 457);
                bezierVertex(372, 469, 380, 479, 392, 489);
                bezierVertex(399, 498, 406, 509, 412, 516);
                bezierVertex(413, 519, 422, 516, 423, 510);
                bezierVertex(421, 503, 411, 491, 401, 481);
                bezierVertex(387, 471, 382, 459, 375, 450);
                bezierVertex(375, 445, 374, 442, 384, 444);
                bezierVertex(391, 450, 400, 456, 405, 458);
            endShape(CLOSE);

            return get(425 - 90, 458 - 90, 180, 180);
        };
        this.img = this.get();
        this.run = function() {
            this.angle+= this.speed / this.circumference * 360;

            pushMatrix();
                translate(425, 458);
                rotate(radians(this.angle));
                translate(-425, -458);
                image(this.img, 425 - 90, 458 - 90);
            popMatrix();
        };
    };
    var BackWheel = function(speed) {
        this.speed = speed;
        this.circumference = 2 * PI * 90;
        this.angle = 0;

        this.get = function() {
            background(0, 0, 0, 0);

            //back
            noFill();
            stroke(247, 197, 150);
            strokeWeight(50);
            ellipse(200, 458, 90, 90);

            stroke(88, 51, 50);
            strokeWeight(25);
            ellipse(200, 458, 65, 65);

            noStroke();
            fill(88, 51, 50);
            beginShape();
                vertex(180, 408);
                bezierVertex(193, 401, 205, 401, 214, 402);
                bezierVertex(221, 407, 233, 412, 244, 420);
                bezierVertex(252, 428, 253, 437, 257, 446);
                bezierVertex(257, 459, 256, 473, 254, 486);
                bezierVertex(250, 493, 241, 498, 236, 504);
                bezierVertex(222, 509, 212, 514, 200, 515);
                bezierVertex(187, 512, 184, 511, 174, 511);
                bezierVertex(164, 501, 157, 492, 150, 481);
                bezierVertex(145, 471, 141, 460, 143, 447);
                bezierVertex(148, 436, 159, 421, 182, 407);
                bezierVertex(226, 409, 181, 418, 173, 426);
                bezierVertex(163, 454, 166, 480, 183, 496);
                bezierVertex(214, 496, 236, 474, 238, 444);
                bezierVertex(228, 425, 208, 415, 188, 412);
            endShape(CLOSE);

            //sprinkles
            stroke(186, 91, 91);
            strokeWeight(4);
            line(200, 410, 204, 414);
            line(228, 440, 233, 435);
            line(233, 469, 235, 474);
            line(211, 495, 214, 500);
            line(176, 482, 180, 485);
            line(163, 445, 167, 445);
            stroke(120, 163, 206);
            line(220, 426, 216, 429);
            line(244, 450, 247, 445);
            line(227, 484, 230, 485);
            line(196, 494, 194, 499);
            line(156, 470, 157, 466);
            line(175, 425, 179, 425);

            return get(200 - 90, 458 - 90, 180, 180);
        };
        this.img = this.get();
        this.run = function() {
            this.angle+= this.speed / this.circumference * 360;

            pushMatrix();
                translate(200, 458);
                rotate(radians(this.angle));
                translate(-200, -458);
                image(this.img, 200 - 90, 458 - 90);
            popMatrix();
        };
    };
    var Tree1 = function(light, dark) {
        //trunk
        noStroke();
        fill(92, 39, 21);
        beginShape();
            vertex(80, 445);
            bezierVertex(82, 435, 84, 419, 82, 395);
            vertex(85, 409);
            vertex(89, 395);
            bezierVertex(87, 419, 88, 432, 98, 445);
        endShape(CLOSE);

        //top
        noStroke();
        fill(dark);
        beginShape();
            vertex(124, 283);
            bezierVertex(138, 281, 152, 293, 140, 312);
            bezierVertex(150, 322, 159, 338, 154, 357);
            bezierVertex(148, 369, 140, 372, 127, 376);
            bezierVertex(127, 390, 118, 401, 106, 397);
            bezierVertex(78, 405, 54, 395, 43, 368);
        endShape(CLOSE);
        fill(light);
        beginShape();
            vertex(81, 255);
            bezierVertex(89, 248, 104, 244, 120, 255);
            bezierVertex(139, 274, 133, 315, 110, 345);
            bezierVertex(89, 365, 62, 380, 44, 378);
            bezierVertex(30, 378, 17, 361, 19, 342);
            bezierVertex(10, 338, 10, 328, 19, 319);
            bezierVertex(17, 301, 24, 281, 46, 272);
            bezierVertex(46, 255, 56, 245, 81, 255);
        endShape(CLOSE);

        //leaves
        noStroke();
        fill(light);
        beginShape();
            vertex(38, 265);
            vertex(34, 267);
            vertex(31, 267);
            vertex(28, 265);
            vertex(29, 264);
            vertex(32, 263);
            vertex(36, 264);
        endShape(CLOSE);
        fill(light);
        beginShape();
            vertex(39, 262);
            vertex(39, 257);
            vertex(36, 253);
            vertex(34, 252);
            vertex(33, 256);
            vertex(35, 259);
            vertex(38, 262);
        endShape(CLOSE);
        fill(light);
        beginShape();
            vertex(140, 266);
            vertex(141, 262);
            vertex(142, 259);
            vertex(144, 256);
            vertex(144, 258);
            vertex(143, 261);
            vertex(140, 265);
        endShape(CLOSE);
        fill(light);
        beginShape();
            vertex(143, 268);
            vertex(147, 264);
            vertex(151, 264);
            vertex(154, 264);
            vertex(152, 266);
            vertex(149, 267);
            vertex(146, 267);
        endShape(CLOSE);
        fill(dark);
        beginShape();
            vertex(82, 362);
            bezierVertex(82, 359, 82, 355, 88, 351);
            bezierVertex(89, 356, 88, 360, 82, 362);
        endShape(CLOSE);
        fill(dark);
        beginShape();
            vertex(79, 364);
            bezierVertex(75, 362, 73, 360, 74, 356);
            bezierVertex(78, 358, 80, 361, 79, 364);
        endShape(CLOSE);
    };
    var Tree2 = function(light, dark) {
        //trunk
        noStroke();
        fill(92, 39, 21);
        beginShape();
            vertex(228, 447);
            bezierVertex(232, 437, 234, 421, 232, 405);
            vertex(235, 419);
            vertex(239, 405);
            bezierVertex(237, 423, 238, 434, 248, 447);
        endShape(CLOSE);
        //bush
        noStroke();
        fill(dark);
        beginShape();
            vertex(272, 341);
            bezierVertex(281, 345, 289, 357, 278, 371);
            bezierVertex(280, 396, 263, 410, 240, 408);
            bezierVertex(234, 411, 226, 409, 220, 406);
            bezierVertex(200, 406, 192, 399, 190, 382);
        endShape(CLOSE);
        fill(light);
        beginShape();
            vertex(224, 322);
            bezierVertex(231, 311, 246, 308, 254, 320);
            bezierVertex(269, 319, 282, 328, 277, 356);
            bezierVertex(267, 379, 244, 389, 207, 393);
            bezierVertex(187, 391, 183, 371, 200, 360);
            bezierVertex(200, 342, 207, 327, 223, 323);
        endShape(CLOSE);

        //leaves
        noStroke();
        fill(dark);
        beginShape();
            vertex(217, 337);
            vertex(218, 334);
            vertex(217, 332);
            vertex(214, 328);
            vertex(213, 331);
            vertex(213, 334);
            vertex(215, 337);
        endShape(CLOSE);
        beginShape();
            vertex(215, 339);
            vertex(212, 337);
            vertex(209, 337);
            vertex(207, 337);
            vertex(207, 338);
            vertex(210, 341);
            vertex(214, 341);
        endShape(CLOSE);
        fill(light);
        beginShape();
            vertex(267, 319);
            vertex(266, 313);
            vertex(266, 312);
            vertex(269, 308);
            vertex(269, 312);
            vertex(269, 313);
            vertex(267, 316);
        endShape(CLOSE);
        beginShape();
            vertex(272, 317);
            vertex(272, 315);
            vertex(273, 313);
            vertex(276, 311);
            vertex(276, 314);
            vertex(275, 315);
            vertex(271, 317);
        endShape(CLOSE);
    };
    var Bush1 = function() {
        noStroke();
        fill(223, 90, 47);
        beginShape();
            vertex(188, 450);
            bezierVertex(186, 440, 190, 433, 200, 433);
            bezierVertex(208, 425, 222, 428, 220, 436);
            bezierVertex(223, 437, 227, 441, 226, 450);
        endShape(CLOSE);
    };
    var Bush2 = function() {
        noStroke();
        fill(223, 90, 47);
        beginShape();
            vertex(412, 450);
            bezierVertex(414, 440, 424, 439, 433, 442);
            bezierVertex(433, 439, 434, 435, 440, 433);
            bezierVertex(450, 419, 469, 416, 479, 423);
            bezierVertex(487, 415, 503, 417, 509, 427);
            bezierVertex(519, 425, 528, 429, 530, 437);
            bezierVertex(537, 436, 543, 437, 548, 450);
        endShape(CLOSE);
    };
    var Bush3 = function() {
        noStroke();
        fill(223, 90, 47);
        beginShape();
            vertex(42, 450);
            bezierVertex(44, 440, 50, 440, 58, 441);
            bezierVertex(60, 437, 61, 433, 64, 429);
            bezierVertex(70, 425, 85, 426, 92, 432);
            bezierVertex(96, 432, 104, 435, 106, 439);
            bezierVertex(108, 438, 114, 439, 116, 450);
        endShape(CLOSE);
    };
    var Bush4 = function() {
        noStroke();
        fill(223, 90, 47);
        beginShape();
            vertex(256, 450);
            bezierVertex(250, 440, 252, 432, 262, 431);
            bezierVertex(264, 427, 273, 422, 280, 426);
            bezierVertex(285, 424, 291, 425, 297, 430);
            bezierVertex(306, 430, 309, 437, 305, 450);
        endShape(CLOSE);
    };
    var Trees1 = function() {
        image(scene.images.tree1, 10, 255);

        pushMatrix();
            translate(290, 313);
            scale(-1, 1);
            image(scene.images.tree2, 0, 0);
        popMatrix();

        pushMatrix();
            translate(300, 275);
            scale(0.9);
            image(scene.images.tree3, 0, 0);
        popMatrix();

        image(scene.images.tree4, 490, 313);
    };
    var Trees2 = function() {
        image(scene.images.tree1, 10, 255);

        pushMatrix();
            translate(350, 275);
            scale(-0.9, 0.9);
            image(scene.images.tree3, 0, 0);
        popMatrix();

        image(scene.images.tree2, 490, 313);
    };
    var Buildings = function() {
        noStroke();
        fill(250, 184, 158);
        beginShape();
            vertex(0, 450);
            vertex(0, 268);
            vertex(12, 268);
            vertex(12, 260);
            vertex(21, 260);
            vertex(21, 251);
            vertex(37, 251);
            vertex(37, 260);
            vertex(54, 260);
            vertex(54, 316);
            vertex(65, 316);
            vertex(65, 274);
            vertex(76, 274);
            vertex(76, 261);
            vertex(125, 261);
            vertex(125, 269);
            vertex(148, 269);
            vertex(148, 226);
            vertex(141, 226);
            vertex(141, 216);
            vertex(157, 216);
            vertex(157, 210);
            vertex(172, 210);
            vertex(172, 205);
            vertex(200, 205);
            vertex(200, 213);
            vertex(218, 213);
            vertex(218, 221);
            vertex(211, 221);
            vertex(211, 302);
            vertex(245, 302);
            vertex(245, 255);
            vertex(240, 255);
            vertex(240, 247);
            vertex(258, 247);
            vertex(258, 239);
            vertex(275, 239);
            vertex(275, 230);
            vertex(297, 230);
            vertex(297, 242);
            vertex(319, 242);
            vertex(319, 253);
            vertex(308, 253);
            vertex(308, 346);
            vertex(346, 346);
            vertex(346, 276);
            vertex(361, 276);
            vertex(361, 267);
            vertex(376, 267);
            vertex(376, 275);
            vertex(405, 275);
            vertex(405, 223);
            vertex(398, 223);
            vertex(398, 216);
            vertex(415, 216);
            vertex(415, 212);
            vertex(430, 212);
            vertex(430, 204);
            vertex(457, 204);
            vertex(457, 212);
            vertex(472, 212);
            vertex(472, 221);
            vertex(465, 221);
            vertex(465, 297);
            vertex(504, 297);
            vertex(503, 247);
            vertex(506, 246);
            vertex(506, 239);
            vertex(512, 239);
            vertex(512, 228);
            vertex(522, 228);
            vertex(522, 199);
            vertex(526, 199);
            vertex(526, 189);
            vertex(534, 189);
            vertex(534, 198);
            vertex(539, 198);
            vertex(539, 229);
            vertex(545, 229);
            vertex(545, 236);
            vertex(554, 236);
            vertex(554, 246);
            vertex(558, 246);
            vertex(558, 319);
            vertex(572, 319);
            vertex(572, 273);
            vertex(600, 273);
            vertex(600, 450);
        endShape(CLOSE);
    };
    var Lamp = function() {
        noStroke();
        fill(60, 40, 40);
        beginShape();
            vertex(155, 450);
            vertex(155, 446);
            vertex(160, 444);
            vertex(162, 422);
            vertex(161, 416);
            vertex(165, 407);
            vertex(166, 328);
            vertex(164, 326);
            vertex(164, 323);
            vertex(171, 323);
            vertex(171, 326);
            vertex(169, 328);
            vertex(170, 407);
            vertex(174, 416);
            vertex(173, 422);
            vertex(175, 444);
            vertex(180, 446);
            vertex(180, 450);
        endShape(CLOSE);
        beginShape();
            vertex(157, 305);
            vertex(168, 296);
            vertex(178, 305);
            vertex(160, 305);
        endShape(CLOSE);
        fill(255, 255, 255);
        beginShape();
            vertex(160, 306);
            vertex(175, 306);
            vertex(172, 322);
            vertex(163, 322);
        endShape(CLOSE);
    };
    var Cloud1 = function() {
        noStroke();
        fill(255, 255, 255, 150);
        beginShape();
            vertex(290, 184);
            bezierVertex(293, 180, 296, 177, 306, 179);
            bezierVertex(310, 169, 314, 166, 322, 169);
            bezierVertex(324, 160, 327, 151, 330, 150);
            bezierVertex(337, 145, 347, 148, 355, 165);
            bezierVertex(365, 163, 377, 165, 383, 176);
            bezierVertex(388, 176, 392, 177, 396, 184);
        endShape(CLOSE);
    };
    var Cloud2 = function() {
        noStroke();
        fill(255, 255, 255, 150);
        beginShape();
            vertex(44, 177);
            bezierVertex(46, 172, 52, 169, 60, 171);
            bezierVertex(61, 165, 65, 156, 71, 154);
            bezierVertex(77, 152, 82, 157, 84, 162);
            bezierVertex(88, 161, 94, 162, 98, 168);
            bezierVertex(103, 169, 109, 170, 113, 177);
        endShape(CLOSE);
    };
    var Bike = function(speed) {

        this.s = 0;
        this.c = 0;

        this.frontWheel = new FrontWheel(speed);
        this.backWheel = new BackWheel(speed);

        this.update = function() {
            this.s = sin(scene.timer * 5);
            this.c = cos(scene.timer * 5);
        };
        this.draw = function() {
            //pedal arm
            //back
            noFill();
            stroke(30);
            strokeWeight(5);
            pushMatrix();
                translate(301, 464);
                line(0, 0, this.c * -25, this.s * -25);
                line(this.c * -25 - 10, this.s * -25, this.c * -25 + 10, this.s * -25);
            popMatrix();

            //back leg
            noFill();
            stroke(200);
            strokeWeight(7);

            var leftLeg = getPoint(295, 374, this.c * -25 - 10 + 301, this.s * -25 - 5 + 463, 60, 60);

            //foot
            line(this.c * -25 - 10 + 301, this.s * -25 - 5 + 463, this.c * -25 + 10 + 301, this.s * -25 - 5 + 463);
            //lower leg
            line(this.c * -25 - 10 + 301, this.s * -25 - 5 + 463, leftLeg.x, leftLeg.y);
            //upper leg
            line(295, 374, leftLeg.x, leftLeg.y);

            //wheels
            this.backWheel.run();
            this.frontWheel.run();

            //frame
            stroke(30);
            strokeWeight(6);
            noFill();
            line(200, 458, 290, 409);
            line(290, 409, 377, 378);
            line(384, 390, 301, 464);
            line(301, 464, 200, 458);
            //stem
            line(365, 356, 422, 458);

            //handle bars
            beginShape();
                vertex(366, 355);
                bezierVertex(377, 349, 386, 353, 389, 358);
                bezierVertex(393, 365, 391, 373, 386, 375);
            endShape();

            //seat post
            line(286, 390, 301, 464);

            //seat
            strokeWeight(12);
            line(268, 392, 297, 392);

            //crank
            noStroke();
            fill(30);
            ellipse(301, 464, 24, 24);

            //pedal arm
            //front
            noFill();
            stroke(30);
            strokeWeight(5);
            pushMatrix();
                translate(301, 464);
                line(0, 0, this.c * 25, this.s * 25);
                line(this.c * 25 - 10, this.s * 25, this.c * 25 + 10, this.s * 25);
            popMatrix();

            //cup
            pushMatrix();
                translate(295, 374);
                rotate(radians(this.c * 2));
                translate(-295, -374);

                noStroke();
                fill(245);
                beginShape();
                    vertex(227, 283);
                    bezierVertex(361, 288, 366, 289, 369, 293);
                    bezierVertex(368, 315, 367, 327, 364, 340);
                    bezierVertex(359, 355, 348, 370, 332, 380);
                    bezierVertex(316, 390, 298, 390, 282, 388);
                    bezierVertex(265, 387, 248, 384, 236, 366);
                    bezierVertex(225, 351, 220, 339, 220, 324);
                    bezierVertex(220, 304, 220, 292, 222, 284);
                endShape(CLOSE);

                //handle
                noFill();
                stroke(245);
                strokeWeight(12);
                arc(217, 317, 40, 40, 0, radians(360));

                //eyes
                noStroke();
                fill(30, 30, 30);

                if(this.s > 0.95) {
                    ellipse(326, 324, 10, 4);
                    ellipse(353, 327, 10, 4);
                }
                else {
                    ellipse(326, 324, 10, 10);
                    ellipse(353, 327, 10, 10);
                }

                //mouth
                noFill();
                stroke(30);
                strokeWeight(3);
                arc(340, 335, 12, 13, radians(5), radians(185));
            popMatrix();

            //front leg
            noFill();
            stroke(200);
            strokeWeight(7);

            var rightLeg = getPoint(295, 374, this.c * 25 + 291, this.s * 25 + 458, 60, 60);

            //foot
            line(this.c * 25 + 291, this.s * 25 + 458, this.c * 25 + 311, this.s * 25 + 458);
            //lower leg
            line(this.c * 25 + 291, this.s * 25 + 458, rightLeg.x, rightLeg.y);
            //upper leg
            line(295, 374, rightLeg.x, rightLeg.y);

            //front arm
            var rightArm = getPoint(this.s * 3 + 385, this.c * 3 + 364, 308, 338, 55, 55);

            //upper arm
            line(308 + this.c * 1, 338, rightArm.x + 10, rightArm.y - 20);
            //lower arm
            line(385, 364, rightArm.x + 10, rightArm.y - 20);
            ellipse(385, 364, 7, 7);
        };
        this.run = function() {
            this.draw();
            this.update();
        };
    };
    var Scene = function() {
        this.page = "load";
        this.curLoad = 0;
        this.loaded = false;
        this.images = undefined;
        this.trees = [];
        this.bushes = [];
        this.lamps = [];
        this.clouds = [];
        this.buildings = [];
        this.grounds = [
            {
                x: 0,
                y: 420
            },
            {
                x: width,
                y: 420
            }
        ];
        this.timer = 0;

        this.setup = function() {
            this.images = {
                ground: function() {
                    background(0, 0, 0, 0);
                    noStroke();
                    fill(247, 146, 42);
                    beginShape();
                        vertex(0, 425);
                        bezierVertex(12, 425, 30, 430, 48, 428);
                        bezierVertex(72, 426, 91, 420, 109, 423);
                        bezierVertex(127, 426, 148, 434, 165, 436);
                        bezierVertex(187, 438, 207, 432, 221, 429);
                        bezierVertex(240, 425, 257, 429, 278, 432);
                        bezierVertex(302, 438, 323, 438, 349, 436);
                        bezierVertex(375, 430, 396, 425, 421, 425);
                        bezierVertex(437, 425, 457, 430, 476, 434);
                        bezierVertex(492, 438, 513, 442, 536, 441);
                        bezierVertex(557, 442, 575, 425, 600, 425);
                        vertex(600, 455);
                        vertex(0, 455);
                    endShape(CLOSE);
                    return get(0, 420, width, 35);
                },
                tree1: function() {
                    background(0, 0, 0, 0);
                    Tree1(color(186, 48, 64), color(107, 32, 53));
                    return get(10, 245, 147, 200);
                },
                tree2: function() {
                    background(0, 0, 0, 0);
                    Tree2(color(186, 48, 64), color(107, 32, 53));
                    return get(187, 305, 98, 142);
                },
                tree3: function() {
                    background(0, 0, 0, 0);
                    Tree1(color(247, 146, 42), color(223, 90, 47));
                    return get(10, 245, 147, 200);
                },
                tree4: function() {
                    background(0, 0, 0, 0);
                    Tree2(color(247, 146, 42), color(223, 90, 47));
                    return get(187, 305, 98, 142);
                },
                trees1: function() {
                    background(0, 0, 0, 0);
                    Trees1();
                    return get(0, 255, 600, 200);
                },
                trees2: function() {
                    background(0, 0, 0, 0);
                    Trees2();
                    return get(0, 255, 600, 200);
                },
                bush1: function() {
                    background(0, 0, 0, 0);
                    Bush1();
                    return get(184, 415, 44, 34);
                },
                bush2: function() {
                    background(0, 0, 0, 0);
                    Bush2();
                    return get(409, 415, 140, 34);
                },
                bush3: function() {
                    background(0, 0, 0, 0);
                    Bush3();
                    return get(39, 415, 78, 34);
                },
                bush4: function() {
                    background(0, 0, 0, 0);
                    Bush4();
                    return get(249, 415, 60, 34);
                },
                buildings: function() {
                    background(0, 0, 0, 0);
                    Buildings();
                    return get(0, 187, width, 263);
                },
                lamp: function() {
                    background(0, 0, 0, 0);
                    Lamp();
                    return get(153, 292, 28, 157);
                },
                cloud1: function() {
                    background(0, 0, 0, 0);
                    Cloud1();
                    return get(288, 143, 110, 43);
                },
                cloud2: function() {
                    background(0, 0, 0, 0);
                    Cloud2();
                    return get(42, 150, 72, 30);
                }
            };
        };
        this.setup();
        this.load = function (s) {
            var obj = Object.keys(this.images);
            this.images[obj[this.curLoad]] = this.images[obj[this.curLoad]]();
            this.curLoad++;

            background(80, 80, 80);
            pushStyle();
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(40);
                text('Loading...', 300, 250);
                noStroke();
                fill(240);
                rect(100, 300, this.curLoad * 40, 5, 5);
            popStyle();

            if(this.curLoad < obj.length){
                this.loaded = false;
            }
            else{
                this.loaded = true;
                this.page = s;

                this.buildings.push({
                    x: 0,
                    img: this.images.buildings
                });
                this.buildings.push({
                    x: width,
                    img: this.images.buildings
                });

                this.trees.push({
                    x: 0,
                    img: this.images.trees1
                });
                this.trees.push({
                    x: width,
                    img: this.images.trees2
                });

                this.lamps.push({
                    x: 100,
                    img: this.images.lamp
                });
                this.lamps.push({
                    x: 400,
                    img: this.images.lamp
                });

                this.clouds.push({
                    x: 120,
                    y: random(100, 150),
                    vx: random(0.55, 0.75),
                    img: this.images.cloud1
                });
                this.clouds.push({
                    x: 320,
                    y: random(20, 70),
                    vx: random(0.55, 0.75),
                    img: this.images.cloud2
                });
                this.clouds.push({
                    x: 500,
                    y: random(70, 150),
                    vx: random(0.55, 0.75),
                    img: this.images.cloud1
                });

                this.bushes.push({
                    x: 100,
                    img: this.images.bush1
                });
                this.bushes.push({
                    x: 300,
                    img: this.images.bush2
                });
                this.bushes.push({
                    x: 500,
                    img: this.images.bush3
                });
            }
        };
        this.draw = function() {
            if(this.loaded) {
                //move/display buildings
                for(var i = 0; i < this.buildings.length; i++) {
                    var building = this.buildings[i];

                    image(building.img, building.x, 180);

                    building.x-= 0.5;

                    if(building.x < -width) {
                        building.x = width;
                    }
                }

                //move/display clouds
                for(var i = 0; i < this.clouds.length; i++) {
                    var cloud = this.clouds[i];

                    image(cloud.img, cloud.x, cloud.y);

                    cloud.x-= cloud.vx;

                    if(cloud.x + cloud.img.width < 0) {
                        cloud.x = width;
                        cloud.y = random(20, 150);
                        cloud.vx = random(0.55, 0.75);
                    }
                }

                //ground front
                noStroke();
                fill(173, 93, 96);
                rect(0, 460, width, 140);

                //ground middle (path)
                fill(228, 196, 157);
                rect(0, 450, width, 10);

                //move/display rolling hills
                for(var i = 0; i < this.grounds.length; i++) {
                    var g = this.grounds[i];
                    g.x-= 2;
                    image(this.images.ground, g.x, g.y);
                    if(g.x <= -width) {
                        g.x = width;
                    }
                }

                //move/display bushes
                for(var i = 0; i < this.bushes.length; i++) {
                    var bush = this.bushes[i];

                    image(bush.img, bush.x, 420);

                    bush.x-= 2.8;

                    if(bush.x + bush.img.width < 0) {
                        bush.x = width;
                        switch(~~random(4)) {
                            case 0:
                                bush.img = this.images.bush1;
                                break;
                            case 1:
                                bush.img = this.images.bush2;
                                break;
                            case 2:
                                bush.img = this.images.bush3;
                                break;
                            default:
                                bush.img = this.images.bush4;
                                break;
                        }
                    }
                }

                //move/display trees
                for(var i = 0; i < this.trees.length; i++) {
                    var tree = this.trees[i];

                    image(tree.img, tree.x, 255);

                    tree.x-= 3;

                    if(tree.x < -width) {
                        tree.x = width;
                    }
                }

                //move/display lamps
                for(var i = 0; i < this.lamps.length; i++) {
                    var lamp = this.lamps[i];

                    image(lamp.img, lamp.x, 298);

                    lamp.x-= 3.2;

                    if(lamp.x + lamp.img.width < 0) {
                        lamp.x = width;
                    }
                }
            }
        };
    };

    var speed = 7;
    var steam = new SteamSystem();
    var ground = new GroundSystem(speed);
    var mountains = new MountainSystem(speed);
    var frontWheel = new FrontWheel(speed);
    var backWheel = new BackWheel(speed);
    var bike = new Bike(speed);

    scene = new Scene();

    var play = function() {
        scene.timer+= 0.02;      
        scene.draw();
        ground.run();
        steam.run();
        bike.run();
    };

    draw = function() {
        background(251, 207, 168); //sky

        switch(scene.page) {
            case "load":
                scene.load("play");
                break;
            case "play":
                play();
                break;
        }
    };
  }
}

var canvas = document.getElementById("canvas"); 
var processingInstance = new Processing(canvas, sketchProc);
