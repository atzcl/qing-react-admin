import type { IconifyJSON } from '@iconify/react'

/**
 * Frozen, minimal Iconify subset used by the translated Showcase UI.
 * Keeping these icons local makes first paint deterministic and removes the
 * runtime dependency on api.iconify.design. Unknown picker input can still use
 * Iconify's normal on-demand loader.
 */
export const localIconifyCollections = [
  {
    prefix: 'ant-design',
    lastModified: 1783405210,
    aliases: {},
    width: 1024,
    height: 1024,
    icons: {
      'account-book-filled': {
        body: '<path fill="currentColor" d="M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32M648.3 426.8l-87.7 161.1h45.7c5.5 0 10 4.5 10 10v21.3c0 5.5-4.5 10-10 10h-63.4v29.7h63.4c5.5 0 10 4.5 10 10v21.3c0 5.5-4.5 10-10 10h-63.4V752c0 5.5-4.5 10-10 10h-41.3c-5.5 0-10-4.5-10-10v-51.8h-63.1c-5.5 0-10-4.5-10-10v-21.3c0-5.5 4.5-10 10-10h63.1v-29.7h-63.1c-5.5 0-10-4.5-10-10v-21.3c0-5.5 4.5-10 10-10h45.2l-88-161.1c-2.6-4.8-.9-10.9 4-13.6q2.25-1.2 4.8-1.2h46c3.8 0 7.2 2.1 8.9 5.5l72.9 144.3l73.2-144.3a10 10 0 0 1 8.9-5.5h45c5.5 0 10 4.5 10 10c.1 1.7-.3 3.3-1.1 4.8"/>',
      },
      'alipay-circle-outlined': {
        body: '<path fill="currentColor" fill-rule="evenodd" d="M512 64c247.424 0 448 200.576 448 448S759.424 960 512 960S64 759.424 64 512S264.576 64 512 64m32.493 168c-69.66 0-86.056 16.843-86.709 39.079l-.02 1.426v46.623H291.45c-9.92 0-14.28 23.053-14.27 39.31c0 2.696 2.08 4.923 4.77 4.923h175.814v58.301h-116.5c-9.96 0-14.3 23.76-14.271 39.473a4.77 4.77 0 0 0 4.77 4.76l233.448.003c-4.527 41.056-15.432 77.58-30.716 109.315l-1.224 2.494l-.32-.275c-60.244-28.47-120.431-52.577-194.407-52.577l-2.61.017c-84.982 1.112-144.718 56.503-145.916 127.04l-.018 1.222l.019 2.123c1.238 70.399 63.566 126.452 148.525 126.452c61.245-.008 116.372-16.85 163.457-45.017a139 139 0 0 0 14.068-7.962c18.09-12.116 34.892-25.955 50.304-41.156l9.452 6.344l12.456 8.322c57.527 38.257 113.763 72.617 169.856 79.27a143 143 0 0 0 18.314 1.157c43.017 0 54.991-52.68 57.387-95.508l.145-2.84c.392-8.463-6.197-15.595-14.648-15.863c-75.468-2.365-136.452-22.043-192.008-46.11l-6.267-2.742c35.146-56.8 56.657-121.816 57.155-186.661l.082-1.083c.401-5.515-3.997-10.198-9.52-10.198H549.33v-58.301h165.732c9.92 0 14.28-22.117 14.27-39.311c-.01-2.686-2.089-4.922-4.779-4.922H549.32v-82.35c0-2.656-2.175-4.778-4.827-4.778m-216.5 351.847c54.627 0 107.073 22.417 158.09 52.19l5.77 3.402c-103.575 119.837-247.172 95.903-261.724 26.37a67 67 0 0 1-1.138-9.83l-.057-2.336l.013-.907c.969-40.113 45.337-68.89 99.045-68.89"/>',
      },
      'container-outlined': {
        body: '<path fill="currentColor" d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32m-40 824H232V687h97.9c11.6 32.8 32 62.3 59.1 84.7c34.5 28.5 78.2 44.3 123 44.3s88.5-15.7 123-44.3c27.1-22.4 47.5-51.9 59.1-84.7H792v-63H643.6l-5.2 24.7C626.4 708.5 573.2 752 512 752s-114.4-43.5-126.5-103.3l-5.2-24.7H232V136h560zM320 341h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8m0 160h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8"/>',
      },
      'trademark-outlined': {
        body: '<path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372m87.5-334.7c34.8-12.8 78.4-49 78.4-119.2c0-71.2-45.5-131.1-144.2-131.1H378c-4.4 0-8 3.6-8 8v410c0 4.4 3.6 8 8 8h54.5c4.4 0 8-3.6 8-8V561.2h88.7l74.6 159.2c1.3 2.8 4.1 4.6 7.2 4.6h62a7.9 7.9 0 0 0 7.1-11.5zM522 505h-81.5V357h83.4c48 0 80.9 25.3 80.9 75.5c0 46.9-29.8 72.5-82.8 72.5"/>',
      },
    },
  },
  {
    prefix: 'bi',
    lastModified: 1764827218,
    aliases: {},
    icons: {
      radioactive: {
        body: '<g fill="currentColor"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8"/><path d="M9.653 5.496A3 3 0 0 0 8 5c-.61 0-1.179.183-1.653.496L4.694 2.992A5.97 5.97 0 0 1 8 2c1.222 0 2.358.365 3.306.992zm1.342 2.324a3 3 0 0 1-.884 2.312a3 3 0 0 1-.769.552l1.342 2.683c.57-.286 1.09-.66 1.538-1.103a6 6 0 0 0 1.767-4.624zm-5.679 5.548l1.342-2.684A3 3 0 0 1 5.005 7.82l-2.994-.18a6 6 0 0 0 3.306 5.728ZM10 8a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/></g>',
      },
    },
  },
  {
    prefix: 'bx',
    lastModified: 1722793014,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      'bxl-react': {
        body: '<circle cx="12" cy="11.245" r="1.785" fill="currentColor"/><path d="M7.002 14.794l-.395-.101c-2.934-.741-4.617-2.001-4.617-3.452c0-1.452 1.684-2.711 4.617-3.452l.395-.1l.111.391a19.507 19.507 0 0 0 1.136 2.983l.085.178l-.085.178c-.46.963-.841 1.961-1.136 2.985l-.111.39zm-.577-6.095c-2.229.628-3.598 1.586-3.598 2.542c0 .954 1.368 1.913 3.598 2.54c.273-.868.603-1.717.985-2.54a20.356 20.356 0 0 1-.985-2.542zm10.572 6.095l-.11-.392a19.628 19.628 0 0 0-1.137-2.984l-.085-.177l.085-.179c.46-.961.839-1.96 1.137-2.984l.11-.39l.395.1c2.935.741 4.617 2 4.617 3.453c0 1.452-1.683 2.711-4.617 3.452l-.395.101zm-.41-3.553c.4.866.733 1.718.987 2.54c2.23-.627 3.599-1.586 3.599-2.54c0-.956-1.368-1.913-3.599-2.542a20.683 20.683 0 0 1-.987 2.542z" fill="currentColor"/><path d="M6.419 8.695l-.11-.39c-.826-2.908-.576-4.991.687-5.717c1.235-.715 3.222.13 5.303 2.265l.284.292l-.284.291a19.718 19.718 0 0 0-2.02 2.474l-.113.162l-.196.016a19.646 19.646 0 0 0-3.157.509l-.394.098zm1.582-5.529c-.224 0-.422.049-.589.145c-.828.477-.974 2.138-.404 4.38c.891-.197 1.79-.338 2.696-.417a21.058 21.058 0 0 1 1.713-2.123c-1.303-1.267-2.533-1.985-3.416-1.985zm7.997 16.984c-1.188 0-2.714-.896-4.298-2.522l-.283-.291l.283-.29a19.827 19.827 0 0 0 2.021-2.477l.112-.16l.194-.019a19.473 19.473 0 0 0 3.158-.507l.395-.1l.111.391c.822 2.906.573 4.992-.688 5.718a1.978 1.978 0 0 1-1.005.257zm-3.415-2.82c1.302 1.267 2.533 1.986 3.415 1.986c.225 0 .423-.05.589-.145c.829-.478.976-2.142.404-4.384c-.89.198-1.79.34-2.698.419a20.526 20.526 0 0 1-1.71 2.124z" fill="currentColor"/><path d="M17.58 8.695l-.395-.099a19.477 19.477 0 0 0-3.158-.509l-.194-.017l-.112-.162A19.551 19.551 0 0 0 11.7 5.434l-.283-.291l.283-.29c2.08-2.134 4.066-2.979 5.303-2.265c1.262.727 1.513 2.81.688 5.717l-.111.39zm-3.287-1.421c.954.085 1.858.228 2.698.417c.571-2.242.425-3.903-.404-4.381c-.824-.477-2.375.253-4.004 1.841c.616.67 1.188 1.378 1.71 2.123zM8.001 20.15a1.983 1.983 0 0 1-1.005-.257c-1.263-.726-1.513-2.811-.688-5.718l.108-.391l.395.1c.964.243 2.026.414 3.158.507l.194.019l.113.16c.604.878 1.28 1.707 2.02 2.477l.284.29l-.284.291c-1.583 1.627-3.109 2.522-4.295 2.522zm-.993-5.362c-.57 2.242-.424 3.906.404 4.384c.825.47 2.371-.255 4.005-1.842a21.17 21.17 0 0 1-1.713-2.123a20.692 20.692 0 0 1-2.696-.419z" fill="currentColor"/><path d="M12 15.313c-.687 0-1.392-.029-2.1-.088l-.196-.017l-.113-.162a25.697 25.697 0 0 1-1.126-1.769a26.028 26.028 0 0 1-.971-1.859l-.084-.177l.084-.179c.299-.632.622-1.252.971-1.858c.347-.596.726-1.192 1.126-1.77l.113-.16l.196-.018a25.148 25.148 0 0 1 4.198 0l.194.019l.113.16a25.136 25.136 0 0 1 2.1 3.628l.083.179l-.083.177a24.742 24.742 0 0 1-2.1 3.628l-.113.162l-.194.017c-.706.057-1.412.087-2.098.087zm-1.834-.904c1.235.093 2.433.093 3.667 0a24.469 24.469 0 0 0 1.832-3.168a23.916 23.916 0 0 0-1.832-3.168a23.877 23.877 0 0 0-3.667 0a23.743 23.743 0 0 0-1.832 3.168a24.82 24.82 0 0 0 1.832 3.168z" fill="currentColor"/>',
        hidden: true,
      },
    },
  },
  {
    prefix: 'carbon',
    lastModified: 1785496919,
    aliases: {},
    width: 32,
    height: 32,
    icons: {
      'logo-github': {
        body: '<path fill="currentColor" fill-rule="evenodd" d="M16 2a14 14 0 0 0-4.43 27.28c.7.13 1-.3 1-.67v-2.38c-3.89.84-4.71-1.88-4.71-1.88a3.7 3.7 0 0 0-1.62-2.05c-1.27-.86.1-.85.1-.85a2.94 2.94 0 0 1 2.14 1.45a3 3 0 0 0 4.08 1.16a2.93 2.93 0 0 1 .88-1.87c-3.1-.36-6.37-1.56-6.37-6.92a5.4 5.4 0 0 1 1.44-3.76a5 5 0 0 1 .14-3.7s1.17-.38 3.85 1.43a13.3 13.3 0 0 1 7 0c2.67-1.81 3.84-1.43 3.84-1.43a5 5 0 0 1 .14 3.7a5.4 5.4 0 0 1 1.44 3.76c0 5.38-3.27 6.56-6.39 6.91a3.33 3.33 0 0 1 .95 2.59v3.84c0 .46.25.81 1 .67A14 14 0 0 0 16 2"/>',
      },
      workspace: {
        body: '<path fill="currentColor" d="M16 17v8H6v-8zm0-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2m11-9v5H17V6zm0-2H17a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 13v5h-5v-5zm0-2h-5a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2M11 6v5H6V6zm0-2H6a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2"/>',
      },
    },
  },
  {
    prefix: 'charm',
    lastModified: 1752505820,
    aliases: {},
    icons: {
      organisation: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><rect width="3.5" height="3.5" x="6.75" y="1.75"/><rect width="3.5" height="3.5" x="10.75" y="10.75"/><rect width="3.5" height="3.5" x="2.75" y="10.75"/><path d="m8.5 5.75v2m-3.75 2.5v-2h7.5v2"/></g>',
      },
    },
  },
  {
    prefix: 'devicon',
    lastModified: 1774935148,
    aliases: {},
    width: 128,
    height: 128,
    icons: {
      tailwindcss: {
        body: '<path fill="#38bdf8" d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597c6.398-8.531 13.867-11.73 22.398-9.597c4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602q-9.6 12.803-22.399 9.602c-4.87-1.215-8.347-4.746-12.207-8.66c-6.27-6.367-13.53-13.738-29.394-13.738M32.004 64c-17.066 0-27.73 8.531-32 25.602Q9.603 76.799 22.402 80c4.871 1.215 8.352 4.746 12.207 8.66c6.274 6.367 13.536 13.738 29.395 13.738c17.066 0 27.73-8.53 32-25.597q-9.6 12.797-22.399 9.597c-4.87-1.214-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64m0 0"/>',
      },
    },
  },
  {
    prefix: 'fluent-emoji',
    lastModified: 1761591122,
    aliases: {},
    width: 32,
    height: 32,
    icons: {
      radioactive: {
        body: '<g fill="none"><g filter="url(#iydW8Yd)"><path fill="url(#iHMlQVG)" d="M16.391 29.5c-7.73 0-14-6.27-14-14s6.27-14 14-14s14 6.27 14 14s-6.27 14-14 14"/></g><g fill="#48424E" filter="url(#iH4vJkm)"><path d="m22.004 5.779l-3.688 6.388a.37.37 0 0 0 .11.487a3.5 3.5 0 0 1 1.448 2.503a.377.377 0 0 0 .374.343h7.368a.75.75 0 0 0 .75-.801a12 12 0 0 0-5.295-9.17a.75.75 0 0 0-1.067.25m-11.225 0l3.688 6.388a.37.37 0 0 1-.11.487a3.5 3.5 0 0 0-1.45 2.503a.376.376 0 0 1-.373.343H5.166a.75.75 0 0 1-.749-.801A11.99 11.99 0 0 1 9.712 5.53a.75.75 0 0 1 1.067.249m7.612 9.721a2 2 0 1 1-4 0a2 2 0 0 1 4 0m-.549 3.184a.375.375 0 0 1 .478.157l3.685 6.381a.75.75 0 0 1-.316 1.048a11.95 11.95 0 0 1-5.298 1.23c-1.902 0-3.7-.442-5.297-1.23a.75.75 0 0 1-.317-1.047l3.685-6.382a.374.374 0 0 1 .478-.157a3.48 3.48 0 0 0 2.902 0"/></g><defs><filter id="iydW8Yd" width="29" height="29" x="1.991" y=".9" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dy="-.6"/><feGaussianBlur stdDeviation=".375"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.996078 0 0 0 0 0.490196 0 0 0 0 0.266667 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18590_671"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".6"/><feGaussianBlur stdDeviation=".375"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.996078 0 0 0 0 0.490196 0 0 0 0 0.266667 0 0 0 1 0"/><feBlend in2="effect1_innerShadow_18590_671" result="effect2_innerShadow_18590_671"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".4"/><feGaussianBlur stdDeviation=".25"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.784314 0 0 0 0 0.458824 0 0 0 0 0.196078 0 0 0 1 0"/><feBlend in2="effect2_innerShadow_18590_671" result="effect3_innerShadow_18590_671"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.4" dy=".4"/><feGaussianBlur stdDeviation=".3"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 0.996078 0 0 0 0 0.439216 0 0 0 1 0"/><feBlend in2="effect3_innerShadow_18590_671" result="effect4_innerShadow_18590_671"/></filter><filter id="iH4vJkm" width="24.951" height="23.097" x="3.666" y="5.153" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx="-.75" dy=".75"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.2 0 0 0 0 0.168627 0 0 0 0 0.235294 0 0 0 1 0"/><feBlend in2="shape" result="effect1_innerShadow_18590_671"/><feColorMatrix in="SourceAlpha" result="hardAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/><feOffset dx=".25" dy="-.25"/><feGaussianBlur stdDeviation=".5"/><feComposite in2="hardAlpha" k2="-1" k3="1" operator="arithmetic"/><feColorMatrix values="0 0 0 0 0.290196 0 0 0 0 0.278431 0 0 0 0 0.305882 0 0 0 1 0"/><feBlend in2="effect1_innerShadow_18590_671" result="effect2_innerShadow_18590_671"/></filter><linearGradient id="iHMlQVG" x1="16.391" x2="16.391" y1="1.5" y2="29.5" gradientUnits="userSpaceOnUse"><stop stop-color="#FFD857"/><stop offset=".902" stop-color="#FFAA56"/></linearGradient></defs></g>',
      },
    },
  },
  {
    prefix: 'ic',
    lastModified: 1754899579,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      'baseline-view-in-ar': {
        body: '<path fill="currentColor" d="m18.25 7.6l-5.5-3.18a1.49 1.49 0 0 0-1.5 0L5.75 7.6c-.46.27-.75.76-.75 1.3v6.35c0 .54.29 1.03.75 1.3l5.5 3.18c.46.27 1.04.27 1.5 0l5.5-3.18c.46-.27.75-.76.75-1.3V8.9c0-.54-.29-1.03-.75-1.3M7 14.96v-4.62l4 2.32v4.61zm5-4.03L8 8.61l4-2.31l4 2.31zm1 6.34v-4.61l4-2.32v4.62zM7 2H3.5C2.67 2 2 2.67 2 3.5V7h2V4h3zm10 0h3.5c.83 0 1.5.67 1.5 1.5V7h-2V4h-3zM7 22H3.5c-.83 0-1.5-.67-1.5-1.5V17h2v3h3zm10 0h3.5c.83 0 1.5-.67 1.5-1.5V17h-2v3h-3z"/>',
      },
      'round-menu': {
        body: '<path fill="currentColor" d="M4 18h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1m0-5h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1M3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1"/>',
      },
      'round-settings-input-composite': {
        body: '<path fill="currentColor" d="M5 2c0-.55-.45-1-1-1s-1 .45-1 1v4H2c-.55 0-1 .45-1 1v5h6V7c0-.55-.45-1-1-1H5zm4 14c0 1.3.84 2.4 2 2.82V22c0 .55.45 1 1 1s1-.45 1-1v-3.18c1.16-.41 2-1.51 2-2.82v-2H9zm-8 0c0 1.3.84 2.4 2 2.82V22c0 .55.45 1 1 1s1-.45 1-1v-3.18C6.16 18.4 7 17.3 7 16v-2H1zM21 6V2c0-.55-.45-1-1-1s-1 .45-1 1v4h-1c-.55 0-1 .45-1 1v5h6V7c0-.55-.45-1-1-1zm-8-4c0-.55-.45-1-1-1s-1 .45-1 1v4h-1c-.55 0-1 .45-1 1v5h6V7c0-.55-.45-1-1-1h-1zm4 14c0 1.3.84 2.4 2 2.82V22c0 .55.45 1 1 1s1-.45 1-1v-3.18c1.16-.41 2-1.51 2-2.82v-2h-6z"/>',
      },
    },
  },
  {
    prefix: 'iconoir',
    lastModified: 1776313426,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      drawer: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 14H3m0-6h18m-10 9h2m-2-6h2m-2-6h2m8-2.4v16.8a.6.6 0 0 1-.6.6H3.6a.6.6 0 0 1-.6-.6V2.6a.6.6 0 0 1 .6-.6h16.8a.6.6 0 0 1 .6.6M17.5 20v2m-11-2v2"/>',
      },
    },
  },
  {
    prefix: 'ion',
    lastModified: 1773121730,
    aliases: {},
    width: 512,
    height: 512,
    icons: {
      'bar-chart-outline': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M32 32v432a16 16 0 0 0 16 16h432"/><rect width="80" height="192" x="96" y="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/><rect width="80" height="240" x="240" y="176" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/><rect width="80" height="304" x="383.64" y="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/>',
      },
      'ellipsis-horizontal': {
        body: '<circle cx="256" cy="256" r="48" fill="currentColor"/><circle cx="416" cy="256" r="48" fill="currentColor"/><circle cx="96" cy="256" r="48" fill="currentColor"/>',
      },
      'grid-outline': {
        body: '<rect width="176" height="176" x="48" y="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/><rect width="176" height="176" x="288" y="48" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/><rect width="176" height="176" x="48" y="288" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/><rect width="176" height="176" x="288" y="288" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" rx="20" ry="20"/>',
      },
      'home-outline': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"/>',
      },
      'key-outline': {
        body: '<path fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="32" d="M218.1 167.17c0 13 0 25.6 4.1 37.4c-43.1 50.6-156.9 184.3-167.5 194.5a20.17 20.17 0 0 0-6.7 15c0 8.5 5.2 16.7 9.6 21.3c6.6 6.9 34.8 33 40 28c15.4-15 18.5-19 24.8-25.2c9.5-9.3-1-28.3 2.3-36s6.8-9.2 12.5-10.4s15.8 2.9 23.7 3c8.3.1 12.8-3.4 19-9.2c5-4.6 8.6-8.9 8.7-15.6c.2-9-12.8-20.9-3.1-30.4s23.7 6.2 34 5s22.8-15.5 24.1-21.6s-11.7-21.8-9.7-30.7c.7-3 6.8-10 11.4-11s25 6.9 29.6 5.9c5.6-1.2 12.1-7.1 17.4-10.4c15.5 6.7 29.6 9.4 47.7 9.4c68.5 0 124-53.4 124-119.2S408.5 48 340 48s-121.9 53.37-121.9 119.17ZM400 144a32 32 0 1 1-32-32a32 32 0 0 1 32 32Z"/>',
      },
      'layers-outline': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m434.8 137.65l-149.36-68.1c-16.19-7.4-42.69-7.4-58.88 0L77.3 137.65c-17.6 8-17.6 21.09 0 29.09l148 67.5c16.89 7.7 44.69 7.7 61.58 0l148-67.5c17.52-8 17.52-21.1-.08-29.09M160 308.52l-82.7 37.11c-17.6 8-17.6 21.1 0 29.1l148 67.5c16.89 7.69 44.69 7.69 61.58 0l148-67.5c17.6-8 17.6-21.1 0-29.1l-79.94-38.47"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="m160 204.48l-82.8 37.16c-17.6 8-17.6 21.1 0 29.1l148 67.49c16.89 7.7 44.69 7.7 61.58 0l148-67.49c17.7-8 17.7-21.1.1-29.1L352 204.48"/>',
      },
      'logo-angular': {
        body: '<path fill="currentColor" d="M213.57 256h84.85l-42.43-89.36z"/><path fill="currentColor" d="M256 32L32 112l46.12 272L256 480l177.75-96L480 112Zm88 320l-26.59-56H194.58L168 352h-40L256 72l128 280Z"/>',
      },
      'logo-html5': {
        body: '<path fill="currentColor" d="m64 32l34.94 403.21L255.77 480L413 435.15L448 32Zm308 132H188l4 51h176l-13.51 151.39L256 394.48l-98.68-28l-6.78-77.48h48.26l3.42 39.29L256 343.07l53.42-14.92L315 264H148l-12.59-149.59H376.2Z"/>',
      },
      'logo-javascript': {
        body: '<path fill="currentColor" d="M32 32v448h448V32Zm240 348c0 43.61-25.76 64.87-63.05 64.87c-33.68 0-53.23-17.44-63.15-38.49l34.28-20.75c6.61 11.73 11.63 21.65 26.06 21.65c12 0 21.86-5.41 21.86-26.46V240h44Zm99.35 63.87c-39.09 0-64.35-17.64-76.68-42L329 382c9 14.74 20.75 24.56 41.5 24.56c17.44 0 27.57-7.72 27.57-19.75c0-14.43-10.43-19.54-29.68-28l-10.52-4.52c-30.38-12.92-50.52-29.16-50.52-63.45c0-31.57 24.05-54.63 61.64-54.63c26.77 0 46 8.32 59.85 32.68L396 290c-7.22-12.93-15-18-27.06-18c-12.33 0-20.15 7.82-20.15 18c0 12.63 7.82 17.74 25.86 25.56l10.52 4.51c35.79 15.34 55.94 31 55.94 66.16c.01 37.9-29.76 57.64-69.76 57.64"/>',
      },
      'settings-outline': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M262.29 192.31a64 64 0 1 0 57.4 57.4a64.13 64.13 0 0 0-57.4-57.4M416.39 256a154 154 0 0 1-1.53 20.79l45.21 35.46a10.81 10.81 0 0 1 2.45 13.75l-42.77 74a10.81 10.81 0 0 1-13.14 4.59l-44.9-18.08a16.11 16.11 0 0 0-15.17 1.75A164.5 164.5 0 0 1 325 400.8a15.94 15.94 0 0 0-8.82 12.14l-6.73 47.89a11.08 11.08 0 0 1-10.68 9.17h-85.54a11.11 11.11 0 0 1-10.69-8.87l-6.72-47.82a16.07 16.07 0 0 0-9-12.22a155 155 0 0 1-21.46-12.57a16 16 0 0 0-15.11-1.71l-44.89 18.07a10.81 10.81 0 0 1-13.14-4.58l-42.77-74a10.8 10.8 0 0 1 2.45-13.75l38.21-30a16.05 16.05 0 0 0 6-14.08c-.36-4.17-.58-8.33-.58-12.5s.21-8.27.58-12.35a16 16 0 0 0-6.07-13.94l-38.19-30A10.81 10.81 0 0 1 49.48 186l42.77-74a10.81 10.81 0 0 1 13.14-4.59l44.9 18.08a16.11 16.11 0 0 0 15.17-1.75A164.5 164.5 0 0 1 187 111.2a15.94 15.94 0 0 0 8.82-12.14l6.73-47.89A11.08 11.08 0 0 1 213.23 42h85.54a11.11 11.11 0 0 1 10.69 8.87l6.72 47.82a16.07 16.07 0 0 0 9 12.22a155 155 0 0 1 21.46 12.57a16 16 0 0 0 15.11 1.71l44.89-18.07a10.81 10.81 0 0 1 13.14 4.58l42.77 74a10.8 10.8 0 0 1-2.45 13.75l-38.21 30a16.05 16.05 0 0 0-6.05 14.08c.33 4.14.55 8.3.55 12.47"/>',
      },
    },
  },
  {
    prefix: 'line-md',
    lastModified: 1767255360,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      'compass-filled-loop': {
        body: '<defs><mask id="SVGfa7LP8so"><path fill="#fff" fill-opacity="0" stroke="#fff" stroke-dasharray="60" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"><animate fill="freeze" attributeName="stroke-dashoffset" dur="0.6s" values="60;0"/><animate fill="freeze" attributeName="fill-opacity" begin="0.6s" dur="0.4s" to="1"/></path><path d="M11 11l1 1l1 1l-1 -1Z" transform="rotate(-180 12 12)"><animate fill="freeze" attributeName="d" begin="1.1s" dur="0.3s" to="M10.2 10.2l6.8 -3.2l-3.2 6.8l-6.8 3.2Z"/><animateTransform attributeName="transform" begin="1.1s" dur="9s" keyTimes="0;0.8;0.3;0.36;0.42;0.5;0.58;0.65;0.76;0.84;0.92;1" repeatCount="indefinite" type="rotate" values="-180 12 12;0 12 12;0 12 12;270 12 12;-90 12 12;0 12 12;-180 12 12;-35 12 12;-45 12 12;-110 12 12;-135 12 12;-180 12 12"/></path></mask></defs><g fill="currentColor"><path d="M0 0h24v24H0z" mask="url(#SVGfa7LP8so)"/><circle cx="12" cy="12"><animate fill="freeze" attributeName="r" begin="1.1s" dur="0.3s" to="1"/></circle></g>',
      },
    },
  },
  {
    prefix: 'logos',
    lastModified: 1786851700,
    aliases: {},
    width: 256,
    height: 256,
    icons: {
      'ant-design': {
        body: '<defs><linearGradient id="SVGLtho8dDK" x1="62.102%" x2="108.197%" y1="0%" y2="37.864%"><stop offset="0%" stop-color="#4285eb"/><stop offset="100%" stop-color="#2ec7ff"/></linearGradient><linearGradient id="SVGN6GESbiL" x1="69.644%" x2="54.043%" y1="0%" y2="108.457%"><stop offset="0%" stop-color="#29cdff"/><stop offset="37.86%" stop-color="#148eff"/><stop offset="100%" stop-color="#0a60ff"/></linearGradient><linearGradient id="SVGAM3vtM4q" x1="69.691%" x2="16.723%" y1="-12.974%" y2="117.391%"><stop offset="0%" stop-color="#fa816e"/><stop offset="41.473%" stop-color="#f74a5c"/><stop offset="100%" stop-color="#f51d2c"/></linearGradient><linearGradient id="SVGcuaZ2bVd" x1="68.128%" x2="30.44%" y1="-35.691%" y2="114.943%"><stop offset="0%" stop-color="#fa8e7d"/><stop offset="51.264%" stop-color="#f74a5c"/><stop offset="100%" stop-color="#f51d2c"/></linearGradient></defs><g fill="none"><path fill="url(#SVGLtho8dDK)" d="M116.85 4.545L4.53 116.775a15.396 15.396 0 0 0 0 21.812l112.32 112.229c6.039 6.033 15.792 6.033 21.83 0l47.095-47.056c5.408-5.404 5.408-14.165 0-19.568s-14.176-5.404-19.584 0l-35.702 35.672c-1.503 1.502-3.784 1.502-5.287 0l-89.696-89.622c-1.503-1.502-1.503-3.781 0-5.283l89.696-89.623c1.503-1.501 3.784-1.501 5.287 0l35.702 35.673c5.408 5.404 14.176 5.404 19.584 0s5.408-14.164 0-19.568l-47.09-47.05c-6.063-5.904-15.82-5.856-21.835.154"/><path fill="url(#SVGN6GESbiL)" d="M116.85 4.545L4.53 116.775a15.396 15.396 0 0 0 0 21.812l112.32 112.229c6.039 6.033 15.792 6.033 21.83 0l47.095-47.056c5.408-5.404 5.408-14.165 0-19.568s-14.176-5.404-19.584 0l-35.702 35.672c-1.503 1.502-3.784 1.502-5.287 0l-89.696-89.622c-1.503-1.502-1.503-3.781 0-5.283l89.696-89.623c3.742-3.226 9.849-9.76 18.815-11.29q9.996-1.703 21.857 7.5L138.686 4.39c-6.064-5.903-15.82-5.855-21.836.155"/><path fill="url(#SVGAM3vtM4q)" d="M196.647 173.754c5.408 5.404 14.176 5.404 19.584 0l34.739-34.71a15.396 15.396 0 0 0 0-21.812l-35.041-34.89c-5.421-5.397-14.192-5.389-19.603.018c-5.408 5.404-5.408 14.164 0 19.568l23.667 23.648c1.503 1.502 1.503 3.781 0 5.283l-23.346 23.327c-5.408 5.404-5.408 14.165 0 19.568"/><ellipse cx="128.327" cy="128.242" fill="url(#SVGcuaZ2bVd)" rx="30.327" ry="30.302"/></g>',
      },
      recaptcha: {
        body: '<path fill="#1c3aa9" d="M211.3 84.966a87 87 0 0 0-.087-3.653V12.251l-19.092 19.093C176.494 12.217 152.723 0 126.096 0C98.387 0 73.77 13.226 58.21 33.71l31.295 31.624a41.46 41.46 0 0 1 12.677-14.224c5.464-4.263 13.205-7.75 23.914-7.75c1.294 0 2.293.152 3.026.436c13.269 1.048 24.77 8.37 31.541 18.998L138.51 84.946c28.059-.11 59.756-.174 72.788.015"/><path fill="#4285f4" d="M125.599.003a87 87 0 0 0-3.653.087H52.884l19.093 19.093C52.85 34.809 40.633 58.581 40.633 85.207c0 27.71 13.226 52.327 33.71 67.888l31.624-31.295a41.46 41.46 0 0 1-14.224-12.678c-4.263-5.463-7.75-13.205-7.75-23.914c0-1.293.152-2.292.436-3.026c1.048-13.268 8.37-24.769 18.998-31.54l22.152 22.152c-.11-28.06-.175-59.757.015-72.789"/><path fill="#ababab" d="M40.636 85.205q.005 1.835.087 3.653v69.062l19.093-19.093c15.626 19.127 39.398 31.344 66.024 31.344c27.71 0 52.327-13.226 67.888-33.71l-31.295-31.624a41.46 41.46 0 0 1-12.678 14.224c-5.463 4.263-13.205 7.75-23.914 7.75c-1.293 0-2.292-.152-3.026-.437c-13.268-1.047-24.769-8.37-31.54-18.997l22.152-22.153c-28.06.11-59.757.175-72.789-.014"/><path fill="#a6a6a6" d="M55.013 203.168q-3.113 0-5.582 1.18a11.6 11.6 0 0 0-4.187 3.302q-1.69 2.147-2.603 5.206q-.886 3.033-.886 6.79v7.22q0 3.783.886 6.816q.912 3.032 2.577 5.18q1.663 2.146 4.025 3.3q2.361 1.155 5.314 1.155q3.033 0 5.314-.886q2.308-.885 3.864-2.55q1.557-1.69 2.389-4.079q.859-2.389 1.02-5.421h-4.965q-.188 2.335-.644 3.999q-.457 1.637-1.342 2.71q-.859 1.047-2.255 1.557q-1.369.483-3.381.483q-2.147 0-3.65-.94q-1.503-.965-2.442-2.63q-.912-1.664-1.342-3.891q-.403-2.227-.403-4.804v-7.273q0-2.764.483-5.019q.51-2.254 1.53-3.837t2.577-2.443q1.556-.885 3.703-.885q1.799 0 3.086.537q1.29.51 2.147 1.61q.86 1.073 1.315 2.737q.457 1.664.618 3.972h4.965q-.134-3.166-.993-5.609q-.86-2.442-2.389-4.106q-1.53-1.664-3.73-2.523q-2.174-.858-5.019-.859m121.2 0q-3.114 0-5.583 1.18a11.6 11.6 0 0 0-4.187 3.302q-1.69 2.147-2.603 5.206q-.885 3.033-.885 6.79v7.22q0 3.783.885 6.816q.912 3.032 2.577 5.18q1.663 2.146 4.025 3.3q2.362 1.155 5.314 1.155q3.033 0 5.314-.886q2.308-.885 3.865-2.55q1.555-1.69 2.388-4.079q.86-2.389 1.02-5.421h-4.965q-.188 2.335-.644 3.999q-.456 1.637-1.342 2.71q-.859 1.047-2.254 1.557q-1.37.483-3.382.483q-2.147 0-3.65-.94q-1.503-.965-2.442-2.63q-.912-1.664-1.342-3.891q-.402-2.227-.402-4.804v-7.273q0-2.764.483-5.019q.51-2.254 1.53-3.837t2.576-2.443q1.557-.885 3.703-.885q1.8 0 3.087.537q1.287.51 2.147 1.61q.858 1.073 1.315 2.737t.617 3.972h4.965q-.134-3.166-.993-5.609q-.86-2.442-2.389-4.106q-1.53-1.664-3.73-2.523q-2.174-.858-5.019-.859m-92.911.537L70.715 242.78h5.045l3.033-10.199h13.204l3.086 10.199h5.046l-12.614-39.075zm22.14 0v39.075h4.911V227.48h7.541q2.818 0 4.992-.778q2.174-.805 3.65-2.308q1.503-1.503 2.254-3.704q.78-2.227.779-5.045q0-2.604-.779-4.777q-.75-2.201-2.227-3.784q-1.476-1.611-3.677-2.496q-2.174-.886-4.992-.886zm27.884 0v4.24h10.252v34.835h4.91v-34.835h10.28v-4.24zm61.646 0v39.075h4.91v-18.062h15.728v18.062h4.938v-39.075h-4.938v16.8h-15.727v-16.8zm44.2 0l-12.586 39.075h5.046l3.032-10.199h13.204l3.087 10.199H256l-12.614-39.075zm-128.82 4.24h7.542q1.798 0 3.06.644q1.287.645 2.093 1.718a6.9 6.9 0 0 1 1.207 2.495q.403 1.395.403 2.899q0 1.664-.403 3.06a6.4 6.4 0 0 1-1.207 2.388q-.806.993-2.094 1.556q-1.26.564-3.06.564h-7.54zm-24.958 2.63l5.341 17.766H80.081zm155.872 0l5.34 17.766h-10.654zm-231.175 2.63q-1.853 0-3.194.94q-1.315.94-2.2 2.549l-.081-2.952H0v29.038h4.75v-20.773q.672-1.852 1.906-2.925q1.26-1.074 3.193-1.074q.618 0 1.1.054q.485.026 1.047.134l-.026-4.616a1.6 1.6 0 0 0-.35-.108a3 3 0 0 0-.482-.134a5 5 0 0 0-.564-.08a2.5 2.5 0 0 0-.483-.054zm15.968 0q-2.066 0-3.999.725q-1.932.725-3.435 2.388q-1.476 1.638-2.388 4.294q-.913 2.631-.913 6.468v3.274q0 3.328.779 5.77q.777 2.443 2.227 4.053a9.2 9.2 0 0 0 3.57 2.362q2.092.778 4.696.778q1.878 0 3.355-.376q1.502-.375 2.657-.966a9.3 9.3 0 0 0 1.986-1.395a10.7 10.7 0 0 0 1.422-1.61l-2.469-3.006q-.59.725-1.261 1.341q-.672.591-1.476 1.047a7.7 7.7 0 0 1-1.772.671a9 9 0 0 1-2.173.242q-3.302 0-5.073-2.12q-1.744-2.12-1.744-6.79v-.672h16.21v-2.764q0-3.328-.564-5.877t-1.798-4.294a7.8 7.8 0 0 0-3.167-2.63q-1.932-.913-4.67-.913m0 4.08q1.557 0 2.577.563a4.15 4.15 0 0 1 1.61 1.583q.617 1.02.886 2.443q.295 1.395.375 3.086v.644H20.074q.108-2.442.59-4.053q.484-1.61 1.262-2.549q.805-.966 1.852-1.342a6.7 6.7 0 0 1 2.281-.376"/>',
        height: 244,
      },
      vitejs: {
        body: '<defs><linearGradient id="SVGmrugVdcL" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"/><stop offset="100%" stop-color="#BD34FE"/></linearGradient><linearGradient id="SVGqn4NsbfA" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFEA83"/><stop offset="8.333%" stop-color="#FFDD35"/><stop offset="100%" stop-color="#FFA800"/></linearGradient></defs><path fill="url(#SVGmrugVdcL)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.5 6.5 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62"/><path fill="url(#SVGqn4NsbfA)" d="M185.432.063L96.44 17.501a3.27 3.27 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113"/>',
        height: 257,
        hidden: true,
      },
    },
  },
  {
    prefix: 'lucide',
    lastModified: 1787576027,
    aliases: {
      'curly-braces': {
        parent: 'braces',
      },
    },
    width: 24,
    height: 24,
    icons: {
      annoyed: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 15h8M8 9h2m4 0h2"/></g>',
        hidden: true,
      },
      'app-window': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M10 4v4M2 8h20M6 4v4"/></g>',
      },
      'area-chart': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 12v5h12V8l-5 5l-4-4Z"/></g>',
        hidden: true,
      },
      'badge-check': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77a4 4 0 0 1 6.74 0a4 4 0 0 1 4.78 4.78a4 4 0 0 1 0 6.74a4 4 0 0 1-4.77 4.78a4 4 0 0 1-6.75 0a4 4 0 0 1-4.78-4.77a4 4 0 0 1 0-6.76"/><path d="m9 12l2 2l4-4"/></g>',
      },
      'book-open-text': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v16m4-8h2m-2-4h2m2.001 10A2 2 0 0 0 22 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2a5 5 0 0 1 4-2zM6 13h2M6 9h2"/>',
      },
      'building-2': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M10 12h4m-4-4h4m0 13v-3a2 2 0 0 0-4 0v3"/><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/></g>',
      },
      circle: {
        body: '<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>',
      },
      'circle-check-big': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11l3 3L22 4"/></g>',
      },
      'circle-dot': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/></g>',
      },
      copy: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></g>',
      },
      copyright: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/></g>',
      },
      braces: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2a2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1m8 0h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',
      },
      fullscreen: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><rect width="10" height="8" x="7" y="8" rx="1"/></g>',
      },
      'git-pull-request-arrow': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="5" cy="6" r="3"/><path d="M5 9v12"/><circle cx="19" cy="18" r="3"/><path d="m15 9l-3-3l3-3"/><path d="M12 6h5a2 2 0 0 1 2 2v7"/></g>',
      },
      grape: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M22 5V2l-5.89 5.89"/><circle cx="16.6" cy="15.89" r="3"/><circle cx="8.11" cy="7.4" r="3"/><circle cx="12.35" cy="11.65" r="3"/><circle cx="13.91" cy="5.85" r="3"/><circle cx="18.15" cy="10.09" r="3"/><circle cx="6.56" cy="13.2" r="3"/><circle cx="10.8" cy="17.44" r="3"/><circle cx="5" cy="19" r="3"/></g>',
      },
      'hard-drive-download': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 2v8m4-4l-4 4l-4-4"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 18h.01M10 18h.01"/></g>',
      },
      languages: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 8l6 6m-7 0l6-6l2-3M2 5h12M7 2h1m14 20l-5-10l-5 10m2-4h6"/>',
      },
      'layout-dashboard': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></g>',
      },
      'list-plus': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 5H3m8 7H3m13 7H3M18 9v6m3-3h-6"/>',
      },
      menu: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5h16M4 12h16M4 19h16"/>',
      },
      moon: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',
      },
      navigation: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 11l19-9l-9 19l-2-8z"/>',
      },
      palette: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 22a1 1 0 0 1 0-20a10 9 0 0 1 10 9a5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/></g>',
      },
      'panel-left': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/></g>',
      },
      'panel-right': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M15 3v18"/></g>',
      },
      'panels-top-left': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M9 21V9"/></g>',
      },
      search: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="m21 21l-4.34-4.34"/><circle cx="11" cy="11" r="8"/></g>',
      },
      settings: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0a2.34 2.34 0 0 0 3.319 1.915a2.34 2.34 0 0 1 2.33 4.033a2.34 2.34 0 0 0 0 3.831a2.34 2.34 0 0 1-2.33 4.033a2.34 2.34 0 0 0-3.319 1.915a2.34 2.34 0 0 1-4.659 0a2.34 2.34 0 0 0-3.32-1.915a2.34 2.34 0 0 1-2.33-4.033a2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915"/><circle cx="12" cy="12" r="3"/></g>',
      },
      'sliders-horizontal': {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 5H3m9 14H3M14 3v4m2 10v4m5-9h-9m9 7h-5m5-14h-7m-6 5v4m0-2H3"/>',
      },
      square: {
        body: '<rect width="18" height="18" x="3" y="3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="2"/>',
      },
      'square-check-big': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344"/><path d="m9 11l3 3L22 4"/></g>',
      },
      'square-dot': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="1"/></g>',
      },
      'square-pen': {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g>',
      },
      sun: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g>',
      },
      table: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18M3 15h18"/></g>',
      },
      tags: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1zM2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193"/><circle cx="10.5" cy="6.5" r=".5" fill="currentColor"/></g>',
      },
      user: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></g>',
      },
      users: {
        body: '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M16 3.128a4 4 0 0 1 0 7.744M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/></g>',
      },
    },
  },
  {
    prefix: 'material-symbols',
    lastModified: 1786851780,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      'horizontal-distribute': {
        body: '<path fill="currentColor" d="M2 22V2h2v20zm8.5-5V7h3v10zm9.5 5V2h2v20z"/>',
      },
      resize: {
        body: '<path fill="currentColor" d="M19 9V5h-4V3h6v6zM3 21v-6h2v4h4v2zm0-8v-2h2v2zm0-4V7h2v2zm0-4V3h2v2zm4 0V3h2v2zm4 16v-2h2v2zm0-16V3h2v2zm4 16v-2h2v2zm4 0v-2h2v2zm0-4v-2h2v2zm0-4v-2h2v2z"/>',
      },
    },
  },
  {
    prefix: 'mdi',
    lastModified: 1737398331,
    aliases: {
      'do-not-disturb-alt': {
        parent: 'cancel',
      },
      'encryption-expiration': {
        parent: 'lock-clock',
      },
      'feature-highlight': {
        parent: 'star-circle-outline',
      },
      'lightbulb-error-outline': {
        parent: 'lightbulb-alert-outline',
      },
      offline: {
        parent: 'cloud-off-outline',
      },
      user: {
        parent: 'account',
      },
    },
    width: 24,
    height: 24,
    icons: {
      'account-group': {
        body: '<path fill="currentColor" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20zm24 0h-3.5v-1.75c0-1.03-.36-1.97-.95-2.65c2.56.34 4.45 1.51 4.45 2.9z"/>',
      },
      'alien-outline': {
        body: '<path fill="currentColor" d="M10.31 10.93c1.02 1.64.87 3.57-.35 4.35c-1.22.76-3.04.05-4.07-1.59c-1.02-1.64-.86-3.59.36-4.35s3.04-.05 4.06 1.59M12 17.75c2 0 2.5-.75 2.5-.75s-.5 2-2.5 2s-2.5-1.97-2.5-2c0 0 .5.75 2.5.75m5.75-8.41c1.22.76 1.38 2.71.36 4.35c-1.03 1.64-2.85 2.35-4.07 1.59c-1.22-.78-1.37-2.71-.35-4.35s2.84-2.35 4.06-1.59M12 20c2.5 0 8-5.14 8-9s-3.59-7-8-7s-8 3.14-8 7s5.5 9 8 9m0-18c5.5 0 10 4.04 10 9c0 4.08-5.68 11-10 11S2 15.08 2 11c0-4.96 4.5-9 10-9"/>',
      },
      'animation-play': {
        body: '<path fill="currentColor" d="M4 2h10v2H4v10H2V4c0-1.11.89-2 2-2m4 4h10v2H8v10H6V8c0-1.11.89-2 2-2m4 4h8c1.11 0 2 .89 2 2v8c0 1.11-.89 2-2 2h-8c-1.11 0-2-.89-2-2v-8c0-1.11.89-2 2-2m2 2v8l6-4z"/>',
      },
      'button-cursor': {
        body: '<path fill="currentColor" d="M18.1 15.3c-.1.1-.3.2-.4.3l-2.4.4l1.7 3.6c.2.4 0 .8-.4 1l-2.8 1.3c-.1.1-.2.1-.3.1c-.3 0-.6-.2-.7-.4L11.2 18l-1.9 1.5c-.1.1-.3.2-.5.2c-.4 0-.8-.3-.8-.8V7.5c0-.5.3-.8.8-.8c.2 0 .4.1.5.2l8.7 7.4c.3.2.4.7.1 1M6 12H4V4h16v8h-1.6l2.2 1.9c.8-.3 1.3-1 1.3-1.9V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h2z"/>',
      },
      'check-circle': {
        body: '<path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/>',
      },
      'circle-double': {
        body: '<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8a8 8 0 0 1-8 8a8 8 0 0 1-8-8a8 8 0 0 1 8-8m0 2a6 6 0 0 0-6 6a6 6 0 0 0 6 6a6 6 0 0 0 6-6a6 6 0 0 0-6-6m0 2a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4"/>',
      },
      crop: {
        body: '<path fill="currentColor" d="M7 17V1H5v4H1v2h4v10a2 2 0 0 0 2 2h10v4h2v-4h4v-2m-6-2h2V7a2 2 0 0 0-2-2H9v2h8z"/>',
      },
      cancel: {
        body: '<path fill="currentColor" d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12S6.5 2 12 2m0 2c-1.9 0-3.6.6-4.9 1.7l11.2 11.2c1-1.4 1.7-3.1 1.7-4.9c0-4.4-3.6-8-8-8m4.9 14.3L5.7 7.1C4.6 8.4 4 10.1 4 12c0 4.4 3.6 8 8 8c1.9 0 3.6-.6 4.9-1.7"/>',
      },
      'lock-clock': {
        body: '<path fill="currentColor" d="M8.5 2C6 2 4 4 4 6.5V7c-1.11 0-2 .89-2 2v9c0 1.11.89 2 2 2h4.72c1.46 1.29 3.34 2 5.28 2a8 8 0 0 0 8-8a8 8 0 0 0-8-8c-.34 0-.68.03-1 .08C12.76 3.77 10.82 2 8.5 2m0 2A2.5 2.5 0 0 1 11 6.5V7H6v-.5A2.5 2.5 0 0 1 8.5 4M14 8a6 6 0 0 1 6 6a6 6 0 0 1-6 6a6 6 0 0 1-6-6a6 6 0 0 1 6-6m-1 2v5l3.64 2.19l.78-1.29l-2.92-1.75V10z"/>',
      },
      'star-circle-outline': {
        body: '<path fill="currentColor" d="m8.58 17.25l.92-3.89l-3-2.58l3.95-.37L12 6.8l1.55 3.65l3.95.33l-3 2.58l.92 3.89L12 15.19zM12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 2a8 8 0 0 0-8 8a8 8 0 0 0 8 8a8 8 0 0 0 8-8a8 8 0 0 0-8-8"/>',
      },
      'form-select': {
        body: '<path fill="currentColor" d="M15 5h3l-1.5 2zM5 2h14a2 2 0 0 1 2 2v16c0 1.11-.89 2-2 2H5a2 2 0 0 1-2-2V4c0-1.1.9-2 2-2m0 2v4h14V4zm0 16h14V10H5zm2-8h10v2H7zm0 4h10v2H7z"/>',
      },
      github: {
        body: '<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/>',
      },
      'keyboard-esc': {
        body: '<path fill="currentColor" d="M1 7h6v2H3v2h4v2H3v2h4v2H1zm10 0h4v2h-4v2h2a2 2 0 0 1 2 2v2c0 1.11-.89 2-2 2H9v-2h4v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2m8 0h2a2 2 0 0 1 2 2v1h-2V9h-2v6h2v-1h2v1c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2"/>',
      },
      'lightbulb-alert-outline': {
        body: '<path fill="currentColor" d="M10 2c3.9 0 7 3.1 7 7c0 2.4-1.2 4.5-3 5.7V17c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1v-2.3C4.2 13.5 3 11.4 3 9c0-3.9 3.1-7 7-7M7 21v-1h6v1c0 .6-.4 1-1 1H8c-.6 0-1-.4-1-1m3-17C7.2 4 5 6.2 5 9c0 2.1 1.2 3.8 3 4.6V16h4v-2.4c1.8-.8 3-2.5 3-4.6c0-2.8-2.2-5-5-5m9 8V7h2v6h-2m0 4v-2h2v2z"/>',
      },
      menu: {
        body: '<path fill="currentColor" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"/>',
      },
      'message-settings-outline': {
        body: '<path fill="currentColor" d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2m0 14H5.2L4 17.2V4h16zm-9 8h2v-2h-2zm-4 0h2v-2H7zm8 0h2v-2h-2z"/>',
      },
      'newspaper-variant-multiple-outline': {
        body: '<path fill="currentColor" d="M4 7v12h15v2H4c-2 0-2-2-2-2V7zm17-2v10H8V5zm.3-2H7.7C6.76 3 6 3.7 6 4.55v10.9c0 .86.76 1.55 1.7 1.55h13.6c.94 0 1.7-.69 1.7-1.55V4.55C23 3.7 22.24 3 21.3 3M9 6h3v5H9zm11 8H9v-2h11zm0-6h-6V6h6zm0 3h-6V9h6z"/>',
      },
      'newspaper-variant-outline': {
        body: '<path fill="currentColor" d="M20 5v14H4V5zm0-2H4c-1.11 0-2 .89-2 2v14c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2m-2 12H6v2h12zm-8-8H6v6h4zm2 2h6V7h-6zm6 2h-6v2h6z"/>',
      },
      'cloud-off-outline': {
        body: '<path fill="currentColor" d="M19.8 22.6L17.15 20H6.5q-2.3 0-3.9-1.6T1 14.5q0-1.92 1.19-3.42q1.19-1.51 3.06-1.93q.08-.2.15-.39q.1-.19.15-.41L1.4 4.2l1.4-1.4l18.4 18.4M6.5 18h8.65L7.1 9.95q-.05.28-.07.55q-.03.23-.03.5h-.5q-1.45 0-2.47 1.03Q3 13.05 3 14.5T4.03 17q1.02 1 2.47 1m15.1.75l-1.45-1.4q.43-.35.64-.81T21 15.5q0-1.05-.73-1.77q-.72-.73-1.77-.73H17v-2q0-2.07-1.46-3.54Q14.08 6 12 6q-.67 0-1.3.16q-.63.17-1.2.52L8.05 5.23q.88-.6 1.86-.92Q10.9 4 12 4q2.93 0 4.96 2.04Q19 8.07 19 11q1.73.2 2.86 1.5q1.14 1.28 1.14 3q0 1-.37 1.81q-.38.84-1.03 1.44m-6.77-6.72"/>',
      },
      'page-previous-outline': {
        body: '<path fill="currentColor" d="M2 3h17a2 2 0 0 1 2 2v4h-2V5H2v14h17v-4h2v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2m15 12v-2h7v-2h-7V9l-4 3zM4 13h7v-2H4zm0-4h7V7H4zm0 8h4v-2H4z"/>',
      },
      'server-network-off': {
        body: '<path fill="currentColor" d="M13 19h1a1 1 0 0 1 1 1h.73L13 17.27zm9 1v1.18L20.82 20zm-1 2.72L19.73 24l-2-2H15a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1H2v-2h7a1 1 0 0 1 1-1h1v-2H4a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2.73l-2-2H4a1 1 0 0 1-1-1v-.73l-2-2L2.28 4zM4 3h16a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H9.82L7 6.18V5H5.82L3.84 3zm16 8a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-2.18l-6-6zM9 7h1V5H9zm0 8h1v-.73l-1-1zm-4-2v2h2v-2z"/>',
      },
      'shield-key-outline': {
        body: '<path fill="currentColor" d="M21 11c0 5.55-3.84 10.74-9 12c-5.16-1.26-9-6.45-9-12V5l9-4l9 4zm-9 10c3.75-1 7-5.46 7-9.78V6.3l-7-3.12L5 6.3v4.92C5 15.54 8.25 20 12 21m0-15a3 3 0 0 1 3 3c0 1.31-.83 2.42-2 2.83V14h2v2h-2v2h-2v-6.17A2.99 2.99 0 0 1 9 9a3 3 0 0 1 3-3m0 2a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1"/>',
      },
      'table-off': {
        body: '<path fill="currentColor" d="M22.11 21.46L2.39 1.73L1.11 3l2.11 2.11C3.08 5.38 3 5.68 3 6v12a2 2 0 0 0 2 2h13.11l2.73 2.73zm-12-9.46H5V8h1.11zm.89 6H5v-4h6zm2 0v-3.11L16.11 18zm0-8.2L7.2 4H19c1.11 0 2 .89 2 2v11.8l-2-2V14h-1.8l-2-2H19V8h-6z"/>',
      },
      account: {
        body: '<path fill="currentColor" d="M12 4a4 4 0 0 1 4 4a4 4 0 0 1-4 4a4 4 0 0 1-4-4a4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4"/>',
      },
    },
  },
  {
    prefix: 'mdi-light',
    lastModified: 1722795143,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      'book-multiple': {
        body: '<path fill="currentColor" d="M8 3h9a3 3 0 0 1 3 3v13a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3m0 1a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-3v6.7l-3-2.1l-3 2.1zm5 0H9v4.78l2-1.4l2 1.4zM8 24a5 5 0 0 1-5-5V7h1v12a4 4 0 0 0 4 4h8v1z"/>',
      },
    },
  },
  {
    prefix: 'svg-spinners',
    lastModified: 1754901419,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      'blocks-wave': {
        body: '<rect width="7.33" height="7.33" x="1" y="1" fill="currentColor"><animate id="SVGzjrPLenI" attributeName="x" begin="0;SVGXAURnSRI.end+0.2s" dur="0.6s" values="1;4;1"/><animate attributeName="y" begin="0;SVGXAURnSRI.end+0.2s" dur="0.6s" values="1;4;1"/><animate attributeName="width" begin="0;SVGXAURnSRI.end+0.2s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="0;SVGXAURnSRI.end+0.2s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="8.33" y="1" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="8.33;11.33;8.33"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="1;4;1"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="1" y="8.33" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="1;4;1"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="8.33;11.33;8.33"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.1s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="15.66" y="1" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="15.66;18.66;15.66"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="1;4;1"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="8.33" y="8.33" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="8.33;11.33;8.33"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="8.33;11.33;8.33"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="1" y="15.66" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="1;4;1"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="15.66;18.66;15.66"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.2s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="15.66" y="8.33" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="15.66;18.66;15.66"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="8.33;11.33;8.33"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="8.33" y="15.66" fill="currentColor"><animate attributeName="x" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="8.33;11.33;8.33"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="15.66;18.66;15.66"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.3s" dur="0.6s" values="7.33;1.33;7.33"/></rect><rect width="7.33" height="7.33" x="15.66" y="15.66" fill="currentColor"><animate id="SVGXAURnSRI" attributeName="x" begin="SVGzjrPLenI.begin+0.4s" dur="0.6s" values="15.66;18.66;15.66"/><animate attributeName="y" begin="SVGzjrPLenI.begin+0.4s" dur="0.6s" values="15.66;18.66;15.66"/><animate attributeName="width" begin="SVGzjrPLenI.begin+0.4s" dur="0.6s" values="7.33;1.33;7.33"/><animate attributeName="height" begin="SVGzjrPLenI.begin+0.4s" dur="0.6s" values="7.33;1.33;7.33"/></rect>',
      },
      'wind-toy': {
        body: '<path fill="currentColor" d="M20.27,4.74a4.93,4.93,0,0,1,1.52,4.61,5.32,5.32,0,0,1-4.1,4.51,5.12,5.12,0,0,1-5.2-1.5,5.53,5.53,0,0,0,6.13-1.48A5.66,5.66,0,0,0,20.27,4.74ZM12.32,11.53a5.49,5.49,0,0,0-1.47-6.2A5.57,5.57,0,0,0,4.71,3.72,5.17,5.17,0,0,1,9.53,2.2,5.52,5.52,0,0,1,13.9,6.45,5.28,5.28,0,0,1,12.32,11.53ZM19.2,20.29a4.92,4.92,0,0,1-4.72,1.49,5.32,5.32,0,0,1-4.34-4.05A5.2,5.2,0,0,1,11.6,12.5a5.6,5.6,0,0,0,1.51,6.13A5.63,5.63,0,0,0,19.2,20.29ZM3.79,19.38A5.18,5.18,0,0,1,2.32,14a5.3,5.3,0,0,1,4.59-4,5,5,0,0,1,4.58,1.61,5.55,5.55,0,0,0-6.32,1.69A5.46,5.46,0,0,0,3.79,19.38ZM12.23,12a5.11,5.11,0,0,0,3.66-5,5.75,5.75,0,0,0-3.18-6,5,5,0,0,1,4.42,2.3,5.21,5.21,0,0,1,.24,5.92A5.4,5.4,0,0,1,12.23,12ZM11.76,12a5.18,5.18,0,0,0-3.68,5.09,5.58,5.58,0,0,0,3.19,5.79c-1,.35-2.9-.46-4-1.68A5.51,5.51,0,0,1,11.76,12ZM23,12.63a5.07,5.07,0,0,1-2.35,4.52,5.23,5.23,0,0,1-5.91.2,5.24,5.24,0,0,1-2.67-4.77,5.51,5.51,0,0,0,5.45,3.33A5.52,5.52,0,0,0,23,12.63ZM1,11.23a5,5,0,0,1,2.49-4.5,5.23,5.23,0,0,1,5.81-.06,5.3,5.3,0,0,1,2.61,4.74A5.56,5.56,0,0,0,6.56,8.06,5.71,5.71,0,0,0,1,11.23Z"><animateTransform attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate" values="0 12 12;360 12 12"/></path>',
      },
    },
  },
  {
    prefix: 'system-uicons',
    lastModified: 1754901428,
    aliases: {},
    width: 21,
    height: 21,
    icons: {
      'window-content': {
        body: '<g fill="none" fill-rule="evenodd" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M5.5 3.5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-10a2 2 0 0 1-2-2v-10a2 2 0 0 1 2-2"/><path fill="currentColor" d="M5.5 5.5h10a2 2 0 0 1 2 2v-2c0-1-.895-2-2-2h-10c-1.105 0-2 1-2 2v2a2 2 0 0 1 2-2"/><path d="M7.498 10.5h1m-1-2h3.997m-3.997 4h5.997m-5.997 2h3.997"/></g>',
      },
    },
  },
  {
    prefix: 'tabler',
    lastModified: 1785257700,
    aliases: {},
    width: 24,
    height: 24,
    icons: {
      json: {
        body: '<path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 16V8l3 8V8m-8 0a2 2 0 0 1 2 2v4a2 2 0 1 1-4 0v-4a2 2 0 0 1 2-2M1 8h3v6.5a1.5 1.5 0 0 1-3 0V14m6 1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1"/>',
      },
    },
  },
] satisfies IconifyJSON[]

export const localIconNames = [
  'ant-design:account-book-filled',
  'ant-design:alipay-circle-outlined',
  'ant-design:container-outlined',
  'ant-design:trademark-outlined',
  'bi:radioactive',
  'bx:bxl-react',
  'carbon:logo-github',
  'carbon:workspace',
  'charm:organisation',
  'devicon:tailwindcss',
  'fluent-emoji:radioactive',
  'ic:baseline-view-in-ar',
  'ic:round-menu',
  'ic:round-settings-input-composite',
  'iconoir:drawer',
  'ion:bar-chart-outline',
  'ion:ellipsis-horizontal',
  'ion:grid-outline',
  'ion:home-outline',
  'ion:key-outline',
  'ion:layers-outline',
  'ion:logo-angular',
  'ion:logo-html5',
  'ion:logo-javascript',
  'ion:settings-outline',
  'line-md:compass-filled-loop',
  'logos:ant-design',
  'logos:recaptcha',
  'logos:vitejs',
  'lucide:annoyed',
  'lucide:app-window',
  'lucide:area-chart',
  'lucide:badge-check',
  'lucide:book-open-text',
  'lucide:building-2',
  'lucide:circle',
  'lucide:circle-check-big',
  'lucide:circle-dot',
  'lucide:copy',
  'lucide:copyright',
  'lucide:curly-braces',
  'lucide:fullscreen',
  'lucide:git-pull-request-arrow',
  'lucide:grape',
  'lucide:hard-drive-download',
  'lucide:languages',
  'lucide:layout-dashboard',
  'lucide:list-plus',
  'lucide:menu',
  'lucide:moon',
  'lucide:navigation',
  'lucide:palette',
  'lucide:panel-left',
  'lucide:panel-right',
  'lucide:panels-top-left',
  'lucide:search',
  'lucide:settings',
  'lucide:sliders-horizontal',
  'lucide:square',
  'lucide:square-check-big',
  'lucide:square-dot',
  'lucide:square-pen',
  'lucide:sun',
  'lucide:table',
  'lucide:tags',
  'lucide:user',
  'lucide:users',
  'material-symbols:horizontal-distribute',
  'material-symbols:resize',
  'mdi-light:book-multiple',
  'mdi:account-group',
  'mdi:alien-outline',
  'mdi:animation-play',
  'mdi:button-cursor',
  'mdi:check-circle',
  'mdi:circle-double',
  'mdi:crop',
  'mdi:do-not-disturb-alt',
  'mdi:encryption-expiration',
  'mdi:feature-highlight',
  'mdi:form-select',
  'mdi:github',
  'mdi:keyboard-esc',
  'mdi:lightbulb-error-outline',
  'mdi:menu',
  'mdi:message-settings-outline',
  'mdi:newspaper-variant-multiple-outline',
  'mdi:newspaper-variant-outline',
  'mdi:offline',
  'mdi:page-previous-outline',
  'mdi:server-network-off',
  'mdi:shield-key-outline',
  'mdi:table-off',
  'mdi:user',
  'svg-spinners:blocks-wave',
  'svg-spinners:wind-toy',
  'system-uicons:window-content',
  'tabler:json',
] as const
