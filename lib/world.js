/**
*/
Marble.World	= function(opts)
{
	this._scene	= opts.scene	|| console.assert(false);
	console.assert(this._scene instanceof THREE.Scene);

	this._player	= new Marble.Player();
	this._scene.addObject( this._player.mesh() );

	// this._map	= new Marble.Map();
	// this._scene.addObject( this._map.mesh() );

	this._camera	= new Marble.Camera();

	if( true ){
		// var skybox	= new Marble.Skymap();
		// skyboxMesh	= skybox.mesh();
		// scene.addObject( skyboxMesh );
	}

}


Marble.World.prototype.player	= function(){
	return this._player;
}

// Marble.World.prototype.map	= function(){
// 	return this._map;
// }

Marble.World.prototype.camera	= function(){
	return this._camera;
}

Marble.World.prototype.tick	= function()
{
	this._player.tick();

	// this._map.tick();
	this._camera.tick();
}