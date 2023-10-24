export const Giphy = () => {
  return (
    <section className='w-full h-full px-7 pt-3 grid grid-rows-[auto_7rem]'>
      <div className='w-full h-full border-1 border-gray-330 rounded-12 gap-5 grid place-content-center'>
        giphys
      </div>
      <form className='grid items-center'>
        <label>
          <p className='text-gray-400 font-medium text-13 mb-2'>
            Powered by <span className='font-bold'>GIPHY</span>
          </p>
          <input name='url' placeholder='Buscar en GIPHY' className='bg-gray-230 rounded-10 w-full h-9 pl-2 placeholder:text-gray-330 text-13 text-gray-400 focus-within:outline-none' />
        </label>
      </form>
    </section>
  )
}
