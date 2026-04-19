export async function checkInternet(): Promise<'Excellent' | 'Good' | 'Poor'> {
  const start = Date.now()
  try {
    await fetch('https://siigynfjvcevwrjukxqj.supabase.co/storage/v1/object/public/Images/image-check-speed.png', {
      method: 'HEAD',
      cache: 'no-cache'
    })
    const duration = Date.now() - start

    if (duration < 300) return 'Excellent'
    else if (duration < 800) return 'Good'
    else return 'Poor'
  } catch (error) {
    return 'Poor'
  }
}