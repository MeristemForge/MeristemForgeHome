<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let animationId: number
let resizeHandler: (() => void) | null = null
let particles: Array<{
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}> = []

function getAccentRgb(): string {
  const style = getComputedStyle(document.documentElement)
  return style.getPropertyValue('--accent-rgb').trim() || '74, 222, 128'
}

onMounted(() => {
  const ctx = canvas.value!.getContext('2d')!
  let width = 0
  let height = 0

  function resize() {
    width = canvas.value!.width = canvas.value!.offsetWidth
    height = canvas.value!.height = canvas.value!.offsetHeight
  }

  resize()
  resizeHandler = resize
  window.addEventListener('resize', resize)

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.1,
    })
  }

  function animate() {
    ctx.clearRect(0, 0, width, height)
    const rgb = getAccentRgb()

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      if (p.x < 0 || p.x > width) p.vx *= -1
      if (p.y < 0 || p.y > height) p.vy *= -1

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${rgb}, ${p.opacity})`
      ctx.fill()
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 150) {
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.strokeStyle = `rgba(${rgb}, ${0.15 * (1 - dist / 150)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (resizeHandler) {
    window.removeEventListener('resize', resizeHandler)
  }
  particles = []
})
</script>

<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<style scoped>
.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
