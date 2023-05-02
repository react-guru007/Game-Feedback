import React, { useEffect } from 'react'

interface TagProps {
  tag: string
  setTag: any
  suggestionsData: any
  setSuggestionsData: any
  tagData: any
  setTagData: any
}

export default function Tags({ tag, setTag, suggestionsData, setSuggestionsData, tagData, setTagData }: TagProps) {


  useEffect(() => {
    setTagData(suggestionsData.filter((item: any) => item.category === tag))
  },[tag])

  return (
    <div className='tagsContainer'>
      <ul>
        <li className={tag === 'All' ? 'selected' : ''} onClick={() => setTag('All')}>All</li>
        <li className={tag === 'UI' ? 'selected' : ''} onClick={() => setTag('UI')}>UI</li>
        <li className={tag === 'UX' ? 'selected' : ''} onClick={() => setTag('UX')}>UX</li>
        <li className={tag === 'Enhancement' ? 'selected' : ''} onClick={() => setTag('Enhancement')}>Enhancement</li>
        <li className={tag === 'Bug' ? 'selected' : ''} onClick={() => setTag('Bug')}>Bug</li>
        <li className={tag === 'Feature' ? 'selected' : ''} onClick={() => setTag('Feature')}>Feature</li>
      </ul>
    </div>
  )
}
