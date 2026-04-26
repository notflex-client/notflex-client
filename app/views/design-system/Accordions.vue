<script setup lang="ts">
const faqs = [
  {
    q: 'What is Netflix?',
    a: 'Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.\n\nYou can watch as much as you want, whenever you want – all for one low monthly price. There\'s always something new to discover and new TV shows and movies are added every week!',
  },
  {
    q: 'How much does Netflix cost?',
    a: 'Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from ₫70,000 to ₫260,000 a month. No extra costs, no contracts.',
  },
  {
    q: 'Where can I watch?',
    a: 'Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles.\n\nYou can also download your favorite shows with the iOS or Android app. Use downloads to watch while you\'re on the go and without an internet connection.',
  },
  {
    q: 'How do I cancel?',
    a: 'Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime.',
  },
  {
    q: 'What can I watch on Netflix?',
    a: 'Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want.',
  },
]
</script>

<template>
  <div class="ds-section">

    <div class="ds-block">
      <h3 class="ds-block__title">Accordion</h3>
      <p class="ds-block__desc">Single item — open / closed state</p>
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 660px;">
        <Accordion title="What is Netflix? (closed)" />
        <Accordion title="What is Netflix? (open)" :open="true">
          Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies,
          anime, documentaries, and more on thousands of internet-connected devices.
          <br /><br />
          You can watch as much as you want, whenever you want – all for one low monthly price.
          There's always something new to discover and new TV shows and movies are added every week!
        </Accordion>
      </div>
    </div>

    <div class="ds-block">
      <h3 class="ds-block__title">FAQ — Full list</h3>
      <div style="display: flex; flex-direction: column; gap: 8px; max-width: 660px;">
        <Accordion v-for="item in faqs" :key="item.q" :title="item.q">
          <template v-for="(line, i) in item.a.split('\n')" :key="i">
            <p v-if="line" style="margin: 0 0 12px;">{{ line }}</p>
          </template>
        </Accordion>
      </div>
    </div>

  </div>
</template>
