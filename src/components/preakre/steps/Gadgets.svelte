<script lang="ts">
  import { preakreForm, preakreStep } from '../preakreStore'
  import Controls from '../Controls.svelte'

  let wantTshirt = $preakreForm.tshirt !== undefined
  $: if (!wantTshirt) {
    $preakreForm.tshirt = undefined
  }

  const tshirtSizes = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'] as const
</script>

<form on:submit|preventDefault={() => $preakreStep++}>
  {#if $preakreForm.preakreType === 'premium'}
    <div class="mt-5 mb-3">
      <p class="mb-3">
        Jako <b>Pszczeli Patron</b> otrzymasz <b>specjalny identyfikator</b>
        oraz kilka drobnych upominków.
      </p>
      <p>Dodatkowo możesz zamówić nasze SkierConowe gadżety:</p>
    </div>
  {/if}

  <div class="form-control mt-4">
    <label class="label cursor-pointer items-start justify-start">
      <input
        type="checkbox"
        class="checkbox mr-4 mt-1"
        bind:checked={$preakreForm.mug}
      />
      <div>
        <p class="mb-3 text-lg md:text-xl">
          SkierQubas - Kubek (<span class="text-gray-500">+60,00&nbsp;zł</span>)
        </p>
        <p>
          Legendarny offhand, stworzony w&nbsp;<b
            >Warsztacie Garncarskim Rodziny Konopczyńskich</b
          > w&nbsp;Bolimowie, mieści ok. 400 ml many.
        </p>
        <div
          class="rounded-2xl border-4 border-stone-900 overflow-hidden mt-4 mb-1"
        >
          <img
            src="/shop/kubki_2024.jpg-520x520.webp"
            class="object-cover w-full transition-all duration-200"
            class:opacity-60={!$preakreForm.mug}
            alt="Kubki SkierQubas z poprzednich lat"
            width="520"
            height="520"
          />
        </div>
        <p class="text-sm text-center">
          (Zdjęcie poglądowe - kolory i kształty kubków mogą się różnić)
        </p>
      </div>
    </label>
  </div>

  <div class="divider" />

  <div class="form-control mt-4">
    <label class="label cursor-pointer items-start justify-start">
      <input
        type="checkbox"
        class="checkbox mr-4 mt-1"
        bind:checked={wantTshirt}
      />
      <div>
        <p class="mb-3 text-lg md:text-xl">
          Koszulka konwentowa (<span class="text-gray-500">+40,00&nbsp;zł</span
          >)
        </p>
        <p>
          Wysokiej jakości czarny t-shirt unisex, 100% bawełna, gramatura
          200g/m², nadruk z&nbsp;przodu. <a
            href="https://www.adler-sklep.pl/index.php?controller=attachment&id_attachment=130"
            class="link link-info link-blank"
            target="_blank">Tabela rozmiarów</a
          >
        </p>
        <div
          class="rounded-2xl border-4 border-stone-900 overflow-hidden mt-4 mb-1"
        >
          <img
            src="/shop/koluszka24.png-528x533.webp"
            class="object-cover w-full transition-all duration-200"
            class:opacity-70={!wantTshirt}
            alt="Kubki SkierQubas z poprzednich lat"
            width="641"
            height="335"
          />
        </div>
      </div>
    </label>
  </div>

  {#if wantTshirt}
    <div class="form-control w-full pl-10 my-2">
      <label class="label" for="size">
        <span>Wybierz rozmiar <span class="required">*</span></span>
      </label>
      <select
        class="select select-bordered"
        id="size"
        bind:value={$preakreForm.tshirt}
        required
      >
        <option value="">Wybierz rozmiar</option>
        {#each tshirtSizes as size}
          <option value={size}>{size}</option>
        {/each}
      </select>
    </div>
  {/if}

  <div class="divider" />

  <p class="my-6 alert alert-info shadow-lg">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="stroke-current flex-shrink-0 w-6 h-6"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      /></svg
    >
    SkierQubas i koszulkę będzie można też nabyć w&nbsp;sklepiku konwentowym.
  </p>

  <div class="divider" />

  <div class="form-control mt-4">
    <label class="label cursor-pointer items-start justify-start">
      <input
        type="checkbox"
        class="checkbox mr-4 mt-1"
        bind:checked={$preakreForm.paper}
      />
      <div>
        <p class="mb-3 text-lg md:text-xl">
          Papierowy informator konwentowy (<span class="text-gray-500"
            >+0,00&nbsp;zł</span
          >)
        </p>
        <p class="">
          Chcemy oszczędzać papier i&nbsp;nie produkować niepotrzebnej
          makulatury, dlatego wydrukujemy tylko tyle informatorów konwentowych,
          ile zostanie zamówionych przez uczestników. Dla każdego dostępny
          będzie informator w&nbsp;wersji elektronicznej oraz w&nbsp;<a
            href="https://konwencik.pl/"
            target="_blank"
            class="link link-info link-blank">aplikacji Konwencik</a
          >
        </p>
      </div>
    </label>
  </div>
  <Controls />
</form>
