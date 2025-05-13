import * as THREE from 'three'

/**
 * @param { Object } light 追従を切り替えたいライト
 * @return { Object } targetLightPosition 新しい位置を反映したライトのポジション
 */
export default (light) => {
  const targetLightPositionDefault = new THREE.Vector3(
    light.position.x,
    light.position.y,
    light.position.z,
  )
  const targetLightPosition = targetLightPositionDefault.clone()
  
  let isFollowing = false // 追従フラグ
  
  function onmouseMove(e) {
    const x = (e.clientX / window.innerWidth - 0.5) * 2
    const y = (e.clientY / window.innerHeight - 0.5) * -2
    
    targetLightPosition.x = x * 10
    targetLightPosition.y = y * 5
  }
  function ontouchMove(e) {
    const touch = e.touches[0]
    const x = (touch.clientX / window.innerWidth - 0.5) * 2
    const y = (touch.clientY / window.innerHeight - 0.5) * 2
  
    targetLightPosition.x = x * 10
    targetLightPosition.y = y * 5
  }
  document.getElementById('toggleChaseLightBtn').addEventListener('click', (e) => {
    e.currentTarget.classList.toggle('active')
    isFollowing = !isFollowing // 追従フラグ切り替え
  
    if(isFollowing) {
      window.addEventListener('mousemove', onmouseMove)
      window.addEventListener('touchmove', ontouchMove)
    } else {
      window.removeEventListener('mousemove', onmouseMove)
      window.removeEventListener('touchmove', ontouchMove)

      targetLightPosition.x = targetLightPositionDefault.x
      targetLightPosition.y = targetLightPositionDefault.y
    }
  })

  return targetLightPosition
}
