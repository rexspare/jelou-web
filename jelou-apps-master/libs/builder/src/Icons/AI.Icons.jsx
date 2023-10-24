export function DocAIIcon({ width = 20, height = 20, color = "currentColor" } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 22 25">
      <path
        fill={color}
        d="M7.479 12.731 9.446 6.25h1.852l1.968 6.481h-1.273L10.257 7.06h.231L8.752 12.73H7.479Zm1.157-1.389v-1.157h3.472v1.157H8.636ZM13.729 12.731V6.25h1.273v6.481h-1.273ZM1.808 22.107c-.463 0-.926-.348-.926-.926 0-1.042.347-1.968 1.157-2.662.81-.695 1.62-1.158 2.662-1.158h15.625c.463 0 .926.348.926.926 0 .579-.347.926-.926.926H4.701c-.579 0-1.042.232-1.389.579a2.135 2.135 0 0 0-.579 1.389c0 .578-.463.926-.925.926Z"
      />
      <path
        fill={color}
        d="M20.326 25H4.701c-1.042 0-1.968-.347-2.662-1.157S.882 22.223.882 21.18V3.819c0-1.041.347-1.967 1.157-2.662C2.733.463 3.659 0 4.701 0h15.625c.463 0 .926.347.926.926v23.148c0 .579-.463.926-.926.926ZM4.701 1.852c-.579 0-1.042.231-1.389.579a2.135 2.135 0 0 0-.579 1.388v17.362c0 .578.232 1.041.58 1.388.346.348.925.58 1.388.58h14.815V1.851H4.7Z"
      />
    </svg>
  );
}

export function GenerateCodeAI({ width = 20, height = 20, color = "currentColor" } = {}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 26 26">
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M10.449 17.554 9.5 20.875l-.949-3.32a5.25 5.25 0 0 0-3.605-3.606L1.625 13l3.32-.949a5.25 5.25 0 0 0 3.606-3.605L9.5 5.125l.949 3.32a5.25 5.25 0 0 0 3.605 3.606l3.321.949-3.32.949a5.25 5.25 0 0 0-3.606 3.605ZM20.302 9.167 20 10.375l-.302-1.208a3.937 3.937 0 0 0-2.865-2.865L15.625 6l1.208-.302a3.937 3.937 0 0 0 2.865-2.865L20 1.625l.302 1.208a3.937 3.937 0 0 0 2.865 2.865L24.375 6l-1.208.302a3.937 3.937 0 0 0-2.865 2.865ZM18.71 22.995l-.46 1.38-.46-1.38a2.625 2.625 0 0 0-1.66-1.66l-1.38-.46 1.38-.46a2.625 2.625 0 0 0 1.66-1.66l.46-1.38.46 1.38a2.625 2.625 0 0 0 1.66 1.66l1.38.46-1.38.46a2.625 2.625 0 0 0-1.66 1.66Z"
      />
    </svg>
  );
}

export function EmptyDocs() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="207" height="200" fill="none">
      <path
        fill="#9672C4"
        d="M64.149 127.465H5.266A5.272 5.272 0 0 1 0 122.199V78.417a5.273 5.273 0 0 1 5.266-5.267H64.15a5.273 5.273 0 0 1 5.266 5.267v43.782a5.264 5.264 0 0 1-5.266 5.266Z"
      />
      <path
        fill="#fff"
        d="M49.762 97.134h-2.178a13.127 13.127 0 0 0-1.465-3.353l1.676-1.676a1.633 1.633 0 0 0 0-2.323l-2.363-2.363a1.633 1.633 0 0 0-2.323 0l-1.782 1.782c-.99-.554-2.046-.99-3.167-1.28v-2.68c0-.91-.74-1.637-1.637-1.637H33.17c-.91 0-1.637.74-1.637 1.637v2.706a13.213 13.213 0 0 0-3.075 1.214l-1.967-1.966a1.633 1.633 0 0 0-2.323 0l-2.363 2.362a1.633 1.633 0 0 0 0 2.323l1.822 1.822a13.164 13.164 0 0 0-1.425 3.128H19.64c-.911 0-1.637.74-1.637 1.637v3.352c0 .911.74 1.637 1.637 1.637h2.244c.25 1.241.673 2.416 1.254 3.511l-1.531 1.531a1.633 1.633 0 0 0 0 2.323l2.362 2.363a1.633 1.633 0 0 0 2.323 0l1.333-1.333a12.816 12.816 0 0 0 3.617 1.637v1.861c0 .911.74 1.637 1.637 1.637h3.352c.911 0 1.637-.74 1.637-1.637v-1.729c1.346-.317 2.6-.832 3.749-1.518l1.28 1.28a1.633 1.633 0 0 0 2.323 0l2.363-2.363a1.633 1.633 0 0 0 0-2.323l-1.307-1.306a13.293 13.293 0 0 0 1.439-3.643h2.032c.911 0 1.637-.74 1.637-1.637v-3.353c.027-.884-.713-1.623-1.623-1.623ZM36.496 109.04a8.45 8.45 0 0 1-9.926-9.926c.634-3.327 3.3-5.993 6.627-6.626a8.45 8.45 0 0 1 9.925 9.925c-.633 3.327-3.313 6.006-6.626 6.627Z"
      />
      <path
        fill="#9672C4"
        d="M152.783 97.463H93.901a5.273 5.273 0 0 1-5.267-5.266V48.415a5.273 5.273 0 0 1 5.267-5.267h58.882a5.272 5.272 0 0 1 5.266 5.267v43.782a5.255 5.255 0 0 1-5.266 5.266Z"
      />
      <path
        fill="#fff"
        d="M111.627 79.434c-.41 0-.832-.172-1.149-.502l-7.312-7.827c-.634-.673-.634-1.782 0-2.455l7.444-7.96a1.559 1.559 0 0 1 2.297 0c.634.674.634 1.77 0 2.456l-6.296 6.732 6.164 6.6c.634.672.634 1.768 0 2.454a1.533 1.533 0 0 1-1.148.502ZM135.068 79.434c-.409 0-.832-.172-1.148-.502-.634-.673-.634-1.768 0-2.455l6.177-6.6-6.296-6.731c-.634-.673-.634-1.769 0-2.455a1.559 1.559 0 0 1 2.297 0l7.444 7.96c.304.33.475.765.475 1.227 0 .462-.171.897-.475 1.227l-7.312 7.827c-.33.344-.753.502-1.162.502ZM119.717 81.585a1.44 1.44 0 0 1-.607-.132c-.831-.356-1.227-1.373-.884-2.257l7.26-19.086c.343-.885 1.28-1.32 2.111-.95.832.356 1.228 1.372.885 2.257l-7.26 19.086c-.264.673-.871 1.082-1.505 1.082ZM205.936 107.904H59.846v-4.488c0-1.214.977-2.191 2.191-2.191h141.708c1.215 0 2.191.977 2.191 2.191v4.488Z"
      />
      <path fill="#D3BCF0" d="M201.858 185.78H63.925a4.072 4.072 0 0 1-4.079-4.078v-73.811h146.09v73.811a4.072 4.072 0 0 1-4.078 4.078Z" />
      <path
        fill="#DED1EE"
        d="M198.927 104.565a1.03 1.03 0 1 1-2.06-.002 1.03 1.03 0 0 1 2.06.002ZM191.866 104.565a1.03 1.03 0 0 1-2.059 0c0-.568.462-1.03 1.03-1.03a1.03 1.03 0 0 1 1.029 1.03ZM184.805 104.564c0 .568-.462 1.03-1.03 1.03a1.03 1.03 0 1 1 1.03-1.03ZM148.546 154.366H67.423a1.414 1.414 0 0 1-1.412-1.412c0-.779.633-1.413 1.412-1.413h81.123a1.414 1.414 0 0 1 0 2.825ZM109.846 163.355H67.423a1.414 1.414 0 0 1-1.412-1.412c0-.779.633-1.412 1.412-1.412h42.423c.778 0 1.412.633 1.412 1.412 0 .779-.634 1.412-1.412 1.412Z"
      />
      <path
        fill="#9672C4"
        d="M109.846 172.344H67.423a1.414 1.414 0 0 1 0-2.825h42.423a1.414 1.414 0 0 1 0 2.825ZM148.546 118.424H67.423a1.414 1.414 0 0 1 0-2.825h81.123a1.413 1.413 0 0 1 0 2.825ZM148.546 127.413H67.423a1.414 1.414 0 0 1-1.412-1.412c0-.779.633-1.413 1.412-1.413h81.123a1.414 1.414 0 0 1 0 2.825ZM109.846 136.401H67.423a1.414 1.414 0 0 1-1.412-1.412c0-.779.633-1.413 1.412-1.413h42.423c.778 0 1.412.634 1.412 1.413 0 .778-.634 1.412-1.412 1.412Z"
      />
      <path fill="#fff" d="M148.546 136.401h-30.49a1.414 1.414 0 0 1 0-2.825h30.49c.779 0 1.413.634 1.413 1.413 0 .778-.634 1.412-1.413 1.412Z" />
      <path
        fill="#DED1EE"
        d="m188.804 116.22-21.554 21.554a1.402 1.402 0 0 1-1.994 0 1.403 1.403 0 0 1 0-1.993l21.555-21.554a1.4 1.4 0 0 1 1.993 0 1.403 1.403 0 0 1 0 1.993ZM189.398 159.946c1.619-6.831-2.605-13.681-9.435-15.301-6.831-1.619-13.681 2.605-15.301 9.436-1.619 6.83 2.605 13.68 9.436 15.3 6.83 1.619 13.68-2.605 15.3-9.435Z"
      />
      <path fill="#9672C4" d="M175.367 165.862a7.194 7.194 0 1 1-14.388 0 7.194 7.194 0 0 1 14.388 0Z" />
      <path
        fill="#D3BCF0"
        d="M59.846 177.9v17.977c0 2.851 3.445 4.277 5.465 2.257l18.162-18.162M92.62 64.557H33.737a5.273 5.273 0 0 1-5.266-5.267V15.508a5.273 5.273 0 0 1 5.266-5.266H92.62a5.273 5.273 0 0 1 5.266 5.266V59.29a5.264 5.264 0 0 1-5.266 5.267ZM119.468 14.9c2.204 0 2.719-1.478 2.719-2.798 0-1.161-.119-2.283-.238-3.405-.119-1.201-.238-2.284-.238-3.524 0-3.604 2.205-5.122 5.043-5.122h.475v2.086h-.607c-1.677 0-2.363 1.201-2.363 3.01 0 1.082.119 2.085.237 3.048.08 1.043.198 2.007.198 2.97.04 3.129-1.042 4.21-2.758 4.686v.08c1.716.514 2.798 1.596 2.758 4.764 0 1.003-.118 2.006-.198 3.01-.118 1.003-.237 2.006-.237 3.088 0 1.809.607 3.05 2.402 3.05h.555v2.085h-.515c-2.64 0-5.003-1.32-5.003-5.122 0-1.2.119-2.402.238-3.563.119-1.162.237-2.323.237-3.445 0-1.28-.514-2.838-2.719-2.838V14.9h.014ZM160.293 16.908c-2.205 0-2.719 1.558-2.719 2.838 0 1.122.118 2.283.237 3.445s.238 2.363.238 3.564c0 3.801-2.363 5.121-5.003 5.121h-.515v-2.085h.568c1.808-.198 2.402-1.241 2.402-3.05 0-1.082-.118-2.085-.198-3.088-.118-1.003-.237-2.006-.237-3.01-.04-3.167 1.043-4.25 2.758-4.764v-.08c-1.729-.475-2.798-1.557-2.758-4.685 0-.964.119-1.928.237-2.97.08-.964.198-1.967.198-3.05 0-1.808-.686-2.798-2.362-3.009h-.608V0h.476c2.838 0 5.042 1.518 5.042 5.121 0 1.24-.119 2.323-.238 3.524-.119 1.122-.237 2.244-.237 3.406 0 1.32.514 2.798 2.719 2.798v2.06Z"
      />
      <path fill="#9672C4" d="M146.551 19.811v-7.695l-6.678-3.854-6.666 3.854v7.695l6.666 3.854 6.678-3.854Z" />
      <path
        fill="#9672C4"
        stroke="#9672C4"
        strokeMiterlimit="10"
        d="M196.763 58.208a16.262 16.262 0 0 0-18.769 3.063c-6.125 6.124-6.323 15.931-.647 22.32l-2.442-.29a.527.527 0 0 0-.594.474c-.04.29.172.568.475.594l3.722.45a.579.579 0 0 0 .396-.106.51.51 0 0 0 .198-.357l.423-3.603a.527.527 0 0 0-.475-.594.526.526 0 0 0-.594.475l-.278 2.297c-5.332-5.966-5.147-15.14.581-20.868a15.182 15.182 0 0 1 17.529-2.865.544.544 0 0 0 .726-.237c.119-.29.013-.62-.251-.753ZM182.733 88.105a16.262 16.262 0 0 0 18.769-3.063c6.125-6.124 6.323-15.931.647-22.32l2.442.29c.29.04.567-.17.594-.474a.527.527 0 0 0-.475-.594l-3.723-.45a.579.579 0 0 0-.395.106.51.51 0 0 0-.198.357l-.423 3.603a.527.527 0 0 0 .475.594.526.526 0 0 0 .594-.475l.277-2.297c5.333 5.966 5.148 15.14-.58 20.868a15.181 15.181 0 0 1-17.529 2.865.544.544 0 0 0-.726.237c-.119.29-.013.62.251.753Z"
      />
      <path
        fill="#9672C4"
        d="M87.262 27.375H40.457a2.974 2.974 0 0 1-2.97-2.97 2.974 2.974 0 0 1 2.97-2.97h46.805a2.974 2.974 0 0 1 2.97 2.97 2.974 2.974 0 0 1-2.97 2.97Z"
      />
      <path
        fill="#DED1EE"
        d="M69.588 40.296H40.457a2.974 2.974 0 0 1-2.97-2.97 2.974 2.974 0 0 1 2.97-2.97h29.13a2.974 2.974 0 0 1 2.97 2.97c0 1.637-1.32 2.97-2.97 2.97ZM69.588 54.169H40.457a2.974 2.974 0 0 1-2.97-2.97 2.974 2.974 0 0 1 2.97-2.97h29.13a2.974 2.974 0 0 1 2.97 2.97c0 1.636-1.32 2.97-2.97 2.97Z"
      />
    </svg>
  );
}