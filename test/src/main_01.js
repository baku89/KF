import $ from 'jquery'
import _ from 'lodash'
import THREE from 'expose?THREE!three'
import radians from 'degrees-radians'
import 'OBJLoader'

// my modules
import Keyframe from './keyframe'

const DURATION = 3.0

class App {

	constructor() {

		this.initScene()

		window.addEventListener('resize', this.onResize.bind(this))

		this.loadKeyframes().done(() => {

			this.clock = new THREE.Clock()
			this.clock.start()
			this.render.bind(this)
			this.render()

		})

	}

	loadKeyframes() {
		let d = new $.Deferred

		$.getJSON('../data/jumping_keyframes.json', (keyframes) => {

			this.keyframes = keyframes

			_.each(this.keyframes, (value, key) => {
				console.log(key)
				this.keyframes[key] = new Keyframe(this.keyframes[key])
			})

			console.log(keyframes)

			d.resolve()
		})

		return d.promise()
	}

	initScene() {

		this.scene = new THREE.Scene()

		this.renderer = new THREE.WebGLRenderer({
			canvas: document.getElementById('canvas'),
			antialias: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setClearColor( 0x193441 )

		// add object to scene
		this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000)
		this.camera.position.set(1900, 1500, 1900)
		this.camera.rotation.set(radians(-24), radians(45), 0, 'YXZ')

		let gridHelper = new THREE.GridHelper(2000, 200, 0xD1DBBD, 0x3E606F)
		this.scene.add(gridHelper)

		// light
		{
			let ambientLight = new THREE.AmbientLight(0x193441, 1.4)
			this.scene.add(ambientLight)

			let directionalLight = new THREE.DirectionalLight(0xffffff, 1.2)
			directionalLight.position.set(-200, 300, 200)
			this.scene.add(directionalLight)
		}

		// box
		{
			let geom = new THREE.BoxGeometry(200, 200, 200)
			let mat = new THREE.MeshLambertMaterial({color: 0xDF646F})

			let cubeBody = new THREE.Mesh(geom, mat)
			cubeBody.position.y = 100

			this.cube = new THREE.Object3D()
			this.cube.add(cubeBody)
			this.scene.add(this.cube)
		}
	}

	onResize() {
		console.log('on resize')
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		this.renderer.setSize(window.innerWidth, window.innerHeight)
	}

	render() {
		// console.log(this)
		requestAnimationFrame(this.render.bind(this))

		let time = this.clock.getElapsedTime() % DURATION
		// console.log(time)

		// update value
		let scaleH = this.keyframes.scale_h.getValueAtTime(time)
		let scaleV = this.keyframes.scale_v.getValueAtTime(time)

		this.cube.scale.set(scaleH, scaleV, scaleH)
		this.cube.position.y = this.keyframes.position_y.getValueAtTime(time)
		this.cube.rotation.y = this.keyframes.rotation.getValueAtTime(time)

		this.renderer.render(this.scene, this.camera)
	}

}


new App()
