//'use client'

import React from "react"
import { NextStudio } from "next-sanity/studio"
import config from "../../../studio/sanity.config"

export default function StudioClient() {
  return <NextStudio config={config} />
}
