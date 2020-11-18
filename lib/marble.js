Marble.Marble = function () {
}

var cnot = function(u, v){
    u *= 12 * Math.PI;
    v *= 2 * Math.PI;

    var R = 2;
    var a = 0.5;

    var x = (R + a * Math.cos(u/2)) * Math.cos(u/3) + a * Math.cos(u/3) * Math.cos(v - Math.PI);
    var y = (R + a * Math.cos(u/2)) * Math.sin(u/3) + a * Math.sin(u/3) * Math.cos(v - Math.PI);
    var z = a + Math.sin(u/2) + a * Math.sin (v - Math.PI);

    // target.set(x,y,z);
    return new THREE.Vector3(x, y, z);
};

Marble.Marble.prototype.init = function (opts) {
    // get parameters from opts
    opts = opts || {};
    var color = 'color' in opts ? opts.color : 0xFF69B4;

    this._radius = Marble.tileSize / 2;

    // build this._ballMesh
    var geometry = new THREE.TorusKnotGeometry(22, 10, 80, 10); //new THREE.SphereGeometry(this._radius, 32, 32); // new THREE.ParametricGeometry(cnot, 120, 120, false); //
    var texture = renderer._microCache.getSet('marbleSphereTexture', function () {
        return THREE.ImageUtils.loadTexture("images/planets/moon_1024.jpg");
    });
    var material = new THREE.MeshLambertMaterial({color: color, map: texture});

    this._ballMesh = new THREE.Mesh(geometry, material);
    this._ballMesh.position.y = this._radius;

    this._ballMesh.matrixAutoUpdate = false;
    this._ballMesh.updateMatrix();

    // build this._shadowMesh
    var texture = renderer._microCache.getSet('marbleShadowTexture', function () {
        return THREE.ImageUtils.loadTexture("images/shadow.png");
    });
    var material = new THREE.MeshBasicMaterial({transparent: true, map: texture, opacity: 0.8});
    var geometry = new THREE.PlaneGeometry(2 * this._radius, 2 * this._radius);
    this._shadowMesh = new THREE.Mesh(geometry, material);
    this._shadowMesh.rotation.x = -90 * Math.PI / 180;

    this._shadowMesh.position.y = +0.1;	// +0.001 to ensure the map is above the ground

    // build this._mesh
    this._mesh = new THREE.Object3D();
    this._mesh.addChild(this._ballMesh);
    this._mesh.addChild(this._shadowMesh);

    // init the physics
    this._body = new MarblePhysics.Sphere(this._radius);
    this._body.position.set(-30, 30, 0);
    this._body.speed.set(-1, -1, 0);
    this._body.damping = 1;


    this._speed = new THREE.Vector3(0, 0, 0);
    this._friction = 0.888;
}

Marble.Marble.prototype.mesh = function () {
    return this._mesh;
}


Marble.Marble.prototype.tick = function () {
    // apply friction
    this._speed.multiplyScalar(this._friction);
    // apply speed
    this._mesh.position.addSelf(this._speed);


    var perimeter = 2 * Math.PI * this._radius;
    // FIXME why do i need this 4 ???
    var rotationZ = -4 * this._speed.x / perimeter;
    var rotationX = +4 * this._speed.z / perimeter;

    var mesh = this._ballMesh;

    // solution to get rolling marble from |3d| on freenode
    var matrix = new THREE.Matrix4().setTranslation(0, this._radius, 0);
    matrix.multiplySelf(new THREE.Matrix4().setRotationX(rotationX));
    matrix.multiplySelf(new THREE.Matrix4().setRotationZ(rotationZ));
    matrix.multiplySelf(new THREE.Matrix4().setTranslation(0, -this._radius, 0));
    mesh.matrix.copy(matrix.multiplySelf(mesh.matrix));

    mesh.update(false, true, camera);
}