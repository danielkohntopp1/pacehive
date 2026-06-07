export function parseGroupFormData(formData: FormData) {
  const isFree = formData.get('is_free') === 'true'
  const needsReg = formData.get('needs_registration') === 'true'
  const meetingTime = formData.get('meeting_time') as string

  return {
    name: formData.get('name') as string,
    description: (formData.get('description') as string) || null,
    city: formData.get('city') as string,
    state: (formData.get('state') as string) || null,
    country: 'BR',
    modality: formData.getAll('modality') as string[],
    level: formData.get('level') as string,
    is_free: isFree,
    price_info: (!isFree && formData.get('price_info')) ? formData.get('price_info') as string : null,
    meeting_place: (formData.get('meeting_place') as string) || null,
    meeting_time: meetingTime || null,
    meeting_days: formData.getAll('meeting_days') as string[],
    pace_range: (formData.get('pace_range') as string) || null,
    distance_range: (formData.get('distance_range') as string) || null,
    needs_registration: needsReg,
    how_to_join: (formData.get('how_to_join') as string) || null,
    contact: (formData.get('contact') as string) || null,
    instagram_url: (formData.get('instagram_url') as string) || null,
  }
}
