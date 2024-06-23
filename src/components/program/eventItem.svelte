<script lang="ts">
  import type { ProgramEvent } from 'src/__gen-api'
  export let event: ProgramEvent

  const a11y = Object.entries({
    'Dla dorosłych': event.a11yForAdults,
    'Dla dzieci': event.a11yForChildren,
    'Odpowiedni dla autystów': event.a11yForAutistic,
    'Odpowiedni dla epileptyków': event.a11yForEpileptics,
    'Odpowiedni dla osób z wadami wzroku': event.a11yForVisualImpairment,
    'Odpowiedni dla osób z wadami słuchu': event.a11yForHearingImpairment,
  })
    .filter(([_, value]) => value)
    .map(([key]) => key)
    .join(', ')
</script>

<div class="bg-white shadow-md rounded-lg p-4">
  <h3 class="text-lg font-semibold mb-3">{event.name}</h3>
  {#if event.type}
    <p class="text-sm text-gray-700">
      <strong>Typ:</strong>
      {event.type.name}
    </p>
  {/if}
  {#if event.block}
    <p class="text-sm text-gray-700">
      <strong>Blok:</strong>
      {event.block.name}
    </p>
  {/if}
  {#if event.dateStart && event.dateEnd}
    <p class="text-sm text-gray-700">
      <strong>Czas:</strong>
      {new Date(event.dateStart).toLocaleString()} - {new Date(
        event.dateEnd,
      ).toLocaleString()}
    </p>
  {/if}
  {#if event.authors && event.authors.length > 0}
    <p class="text-sm text-gray-700">
      <strong>Autorzy:</strong>
      {event.authors
        .map(
          author => author.displayName || `${author.name} ${author.lastName}`,
        )
        .join(', ')}
    </p>
  {/if}
  {#if event.place}
    <p class="text-sm text-gray-700">
      <strong>Miejsce:</strong>
      {event.place.name}
    </p>
  {/if}
  {#if a11y.length > 0}
    <p class="text-sm text-gray-700">
      <strong>Dostępność:</strong>
      {a11y}
    </p>
  {/if}
  {#if event.triggers && event.triggers.length > 0}
    <p class="text-sm text-gray-700">
      <strong>Wyzwalacze:</strong>
      {event.triggers.map(trigger => trigger.name).join(', ')}
    </p>
  {/if}

  <p class="text-sm my-3">{@html event.description}</p>
</div>
