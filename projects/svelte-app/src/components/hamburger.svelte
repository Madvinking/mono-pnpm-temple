<script>
export let sidebarOpen = false;
</script>

<style>
div {
  width: 50px;
  height: 40px;
  padding-top: 6px;
  padding-left: 6px;
}

svg {
  min-height: 24px;
  transition: transform 0.3s ease-in-out;
}

svg line {
  stroke: currentColor;
  stroke-width: 3;
  transition: transform 0.3s ease-in-out;
}

.sidebarOpen svg {
  transform: scale(0.7);
}

.sidebarOpen #top {
  transform: translate(6px, 0px) rotate(45deg);
}

.sidebarOpen #middle {
  opacity: 0;
}

.sidebarOpen #bottom {
  transform: translate(-12px, 9px) rotate(-45deg);
}
</style>

<div class:sidebarOpen on:click="{() => (sidebarOpen = !sidebarOpen)}">
  <svg width="32" height="24">
    <line id="top" x1="0" y1="2" x2="32" y2="2"></line>
    <line id="middle" x1="0" y1="12" x2="24" y2="12"></line>
    <line id="bottom" x1="0" y1="22" x2="32" y2="22"></line>
  </svg>
</div>
