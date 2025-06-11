let images = [];
let descriptions = {};
let learned = JSON.parse(localStorage.getItem("learnedList") || "[]");
let viewed = [];
let pointer = -1;
let descVisible = false;
let lastLearned = null;

const imgElem = document.getElementById("cardImage");
const descElem = document.getElementById("description");

async function init() {
    // 최대 시도할 수 있는 숫자 (예: 1~999까지)
    for (let i = 1; i <= 999; i++) {
      const filename = `${i}.jpg`;
      try {
        const res = await fetch(`images/${filename}`, { method: "HEAD" });
        if (res.ok) {
          images.push(filename);
        } else {
          break;
        }
      } catch (e) {
        break;
      }
    }
  
    const res = await fetch("descriptions.json");
    descriptions = await res.json();
  
    nextImage();
}
  

function getRandomImage() {
  const candidates = images.filter(img => !learned.includes(img));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function showImage(filename) {
  imgElem.src = `images/${filename}`;
  descElem.textContent = "";
}

function showDescription(filename) {
    const desc = descriptions[filename] || "설명 없음";
    const lines = desc.split(",").map(s => s.trim()).join("\n");
    descElem.textContent = lines;
  }

function nextImage() {
  const newImg = getRandomImage();
  if (!newImg) {
    imgElem.src = "";
    descElem.textContent = "모든 이미지를 외웠습니다!";
    return;
  }

  if (viewed.length === 10) viewed.shift();
  viewed.push(newImg);
  pointer = viewed.length - 1;
  descVisible = false;
  showImage(newImg);
}

function prevImage() {
  if (pointer > 0) {
    pointer--;
    descVisible = false;
    showImage(viewed[pointer]);
    descElem.textContent = "";
  }
}

function nextOrShowDescription() {
  if (!viewed.length) return;
  if (!descVisible) {
    showDescription(viewed[pointer]);
    descVisible = true;
  } else {
    nextImage();
  }
}

function markLearned() {
  if (!viewed.length) return;
  const current = viewed[pointer];
  if (!learned.includes(current)) {
    learned.push(current);
    localStorage.setItem("learnedList", JSON.stringify(learned));
  }
  lastLearned = current;
  descElem.textContent = "암기완료";
  descVisible = true;
}

function undoLearned() {
  if (!viewed.length) return;
  const current = viewed[pointer];
  if (descElem.textContent === "암기완료" && current === lastLearned) {
    learned = learned.filter(name => name !== current);
    localStorage.setItem("learnedList", JSON.stringify(learned));
    descElem.textContent = "실행취소";
    setTimeout(() => showDescription(current), 1000);
  }
}

function resetLearned() {
  if (confirm("암기 목록을 초기화하시겠습니까?")) {
    learned = [];
    localStorage.removeItem("learnedList");
    descElem.textContent = "암기 목록이 초기화되었습니다.";
    setTimeout(nextImage, 1000);
  }
}

init();
