const header = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const navLinks = document.querySelectorAll(".site-nav a");
const tabs = document.querySelectorAll(".tab");
const galleries = document.querySelectorAll(".galeria-content");
const serviceLinks = document.querySelectorAll(".service-card[data-gallery]");
const timeline = document.getElementById("servicesTimeline");
const timelineProgress = document.getElementById("timelineProgress");
const contactForm = document.getElementById("contactForm");
const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const ba = document.getElementById("ba");
const baBefore = document.getElementById("baBefore");
const baHandle = document.getElementById("baHandle");
const baBeforeImg = document.getElementById("baBeforeImg");
const baAfterImg = document.getElementById("baAfterImg");
const baCurrent = document.getElementById("baCurrent");
const baTabs = document.querySelectorAll(".ba-tab");
const whatsappNumber = "5511990134546";

function setMenu(open){
  document.body.classList.toggle("nav-open", open);
  document.body.style.overflow = open ? "hidden" : "";
  navToggle.setAttribute("aria-expanded", open ? "true" : "false");
  navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
}

function openGallery(id){
  galleries.forEach(gallery => {
    gallery.classList.toggle("active", gallery.id === id);
  });

  tabs.forEach(tab => {
    tab.classList.toggle("active", tab.dataset.gallery === id);
  });
}

function setBeforeAfterPosition(percent){
  if(!baBefore || !baHandle || !baBeforeImg) return;

  const safePercent = Math.max(2, Math.min(98, percent));

  baBefore.style.width = `${safePercent}%`;
  baHandle.style.left = `${safePercent}%`;
  baBeforeImg.style.width = `${10000 / safePercent}%`;
}

function setBeforeAfterFromX(x){
  if(!ba) return;

  const rect = ba.getBoundingClientRect();
  const percent = ((x - rect.left) / rect.width) * 100;

  setBeforeAfterPosition(percent);
}

function openBeforeAfter(button){
  if(!button || !baBeforeImg || !baAfterImg) return;

  baTabs.forEach(tab => {
    tab.classList.toggle("active", tab === button);
  });

  baBeforeImg.src = button.dataset.before;
  baAfterImg.src = button.dataset.after;

  const title = button.dataset.title || button.textContent.trim();

  baBeforeImg.alt = `Antes - ${title}`;
  baAfterImg.alt = `Depois - ${title}`;

  if(baCurrent){
    baCurrent.textContent = title;
  }

  setBeforeAfterPosition(50);
}

function updateTimeline(){
  if(!timeline || !timelineProgress) return;

  const rect = timeline.getBoundingClientRect();
  const viewportPoint = window.innerHeight * 0.68;
  const rawProgress = (viewportPoint - rect.top) / rect.height;
  const progress = Math.max(0, Math.min(1, rawProgress));

  timelineProgress.style.height = `${progress * 100}%`;
}

function updateHeader(){
  header.classList.toggle("scrolled", window.scrollY > 20);
}

navToggle.addEventListener("click", () => {
  setMenu(!document.body.classList.contains("nav-open"));
});

navLinks.forEach(link => {
  link.addEventListener("click", () => setMenu(false));
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => openGallery(tab.dataset.gallery));
});

baTabs.forEach(tab => {
  tab.addEventListener("click", () => openBeforeAfter(tab));
});

if(ba){
  let baDragging = false;

  ba.addEventListener("pointerdown", event => {
    baDragging = true;
    ba.setPointerCapture(event.pointerId);
    setBeforeAfterFromX(event.clientX);
  });

  ba.addEventListener("pointermove", event => {
    if(!baDragging) return;
    setBeforeAfterFromX(event.clientX);
  });

  ba.addEventListener("pointerup", () => {
    baDragging = false;
  });

  ba.addEventListener("pointerleave", () => {
    baDragging = false;
  });

  setBeforeAfterPosition(50);
}



serviceLinks.forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();

    if (link.dataset.gallery === "depilacao") {
      return;
    }

    openGallery(link.dataset.gallery);
    document.getElementById("galeria").scrollIntoView({
      behavior: "smooth"
    });
  });
});

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();
  const texto = `Ola! Meu nome e ${nome}. ${mensagem}`;
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(texto)}`;

  window.open(url, "_blank");
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    }
  });
}, {threshold:0.18});

document.querySelectorAll(".reveal, .reveal-step").forEach(element => {
  observer.observe(element);
});

document.querySelectorAll(".grid img").forEach(image => {
  image.addEventListener("click", () => {
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  });
});

function closeModal(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalImage.src = "";
}

modalClose.addEventListener("click", closeModal);
modal.addEventListener("click", event => {
  if(event.target === modal) closeModal();
});

document.addEventListener("keydown", event => {
  if(event.key === "Escape") closeModal();
});

window.addEventListener("scroll", () => {
  updateHeader();
  updateTimeline();
}, {passive:true});

window.addEventListener("resize", updateTimeline);

window.addEventListener("resize", () => {
  if(window.innerWidth > 1100){
    setMenu(false);
  }
});

updateHeader();
updateTimeline();
