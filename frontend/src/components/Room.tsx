import { useEffect } from "react";

const URL = "http://localhost:3000";

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
}) => {
  const [lobby, setLobby] = useState(true);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer", async ({ roomId }) => {
      console.log("sending offer");
      setLobby(false);
      const pc = new RTCPeerConnection();
      setSendingPc(pc);
      if (localVideoTrack) {
        console.log("added track");

        console.log(localVideoTrack);
        pc.addTrack(localVideoTrack);
      }

      if (localAudioTrack) {
        console.log("added audio");
        console.log(localAudioTrack);
        pc.addTrack(localAudioTrack);
      }

      pc.onicecandidate = async (e) => {
        console.log("receiving ice candidate locally");
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };

      pc.onnegotiationneeded = async () => {
        console.log("on negotiation needed, sending offer");
        const sdp = await pc.createOffer();
        pc.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };

      socket.on("offer",  async ({roomId, sdp: remoteSdp})) => {
        console.log("recieved offer")
        setLobby(false)
        const pc = new RTCPeerConnection();
        pc.setRemoteDescription(remoteSdp)
      }
    });
  });

  return <div>Hi {name}</div>;
};
