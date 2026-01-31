import { useEffect } from "react"

export default function WatsonxChat() {
  useEffect(() => {
    if (window.__wxoLoaded) return
    window.__wxoLoaded = true

    window.wxOConfiguration = {
      orchestrationID: "undefined",
      hostURL: "https://us-south.watson-orchestrate.cloud.ibm.com",
      rootElementID: "watsonx-root",
      deploymentPlatform: "ibmcloud",
      crn: "crn:v1:bluemix:public:watsonx-orchestrate:us-south:a/7445bd1a78dc48d58d7476e028dee8d3:4f31b06e-2741-4951-bc30-39da30794efe::",
      chatOptions: {
        agentId: "f8cd61ef-88f8-40e6-8c9e-c513f3512a6d",
        agentEnvironmentId: "2f22ff28-4e58-4917-9c31-e638220d4eb2",
      },
    }

    const script = document.createElement("script")
    script.src = `${window.wxOConfiguration.hostURL}/wxochat/wxoLoader.js?embed=true`
    script.async = true

    script.onload = () => {
      if (window.wxoLoader) {
        window.wxoLoader.init()
      }
    }

    document.head.appendChild(script)

    return () => {
      const root = document.getElementById("watsonx-root")
      if (root) root.innerHTML = ""
    }
  }, [])

  return (
    <div
      id="watsonx-root"
      className="w-full h-full min-h-[350px] max-h-[500px] rounded-lg border border-cyan-400/30 bg-black/30 overflow-hidden"
    />
  )
}
  