<script lang="ts">
  import type { ProgramEvent } from 'src/__gen-api'
  export let event: ProgramEvent

  function getTime(date?: string) {
    return new Date(date!).toLocaleTimeString('pl', {
      timeZone: 'Europe/Warsaw',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getDate(date?: string) {
    return new Date(date!).toLocaleDateString('pl', {
      timeZone: 'Europe/Warsaw',
      weekday: 'long',
    })
  }
</script>

<div class="p-6 mb-1 border border-zinc-300 shadow-sm rounded-xl">
  <div class="md:flex md:justify-between">
    <div>
      <p class="text-sm">
        <span class="material-symbols-outlined info-icon">schedule</span>
        {getTime(event.dateStart)} - {getTime(event.dateEnd)}, {getDate(
          event.dateStart,
        )}
      </p>
      <p class="text-sm">
        <span class="material-symbols-outlined info-icon">location_on</span>
        {event.place?.name} ({event.place?.programArea.name})
      </p>
      {#if event.authors.length > 0}
        <p class="text-sm">
          <span class="material-symbols-outlined info-icon">person</span>
          {#each event.authors as author, i}
            {#if author.guest}
              <a
                href={`/goscie/${author.slug}`}
                target="_blank"
                class="underline hover:no-underline text-blue-600"
              >
                {author.displayName}</a
              >{:else}
              {author.displayName}
            {/if}{#if i < event.authors.length - 1},&nbsp;
            {/if}
          {/each}
        </p>
      {/if}
    </div>
    <div>
      <p class="text-sm">
        <span class="material-symbols-outlined info-icon">label</span>
        {event.type?.name}
      </p>
      <p class="text-sm">
        <span class="material-symbols-outlined info-icon">layers</span>
        {event.block?.name}
      </p>
    </div>
  </div>

  <h2 class="text-xl font-bold my-4">{event.name}</h2>
  <div class="wysiwyg text-sm my-2">{@html event.description}</div>

  {#if event.triggers && event.triggers.length > 0}
    <p class="text-sm mt-4">
      <span class="material-symbols-outlined info-icon">warning</span>
      {event.triggers.map(trigger => trigger.name).join(', ')}
    </p>
  {/if}
</div>

<style>
  .info-icon {
    font-size: 18px;
    transform: translateY(3px);
    display: inline-block;
    margin-right: 4px;
  }
</style>
