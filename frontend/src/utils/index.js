import * as THREE from 'three'

export const getFileName = filePath => filePath?.replaceAll("\\", "/").split("/").pop() ?? "";

export const getInvertedColor = sourceColor => {
	const base = new THREE.Color(sourceColor)
	return new THREE.Color(1 - base.r, 1 - base.g, 1 - base.b).getStyle()
}
