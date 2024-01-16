import contractJSON from "@/contracts/Voting.sol/Voting.json" assert { type: "json" };
import { useReadContract } from "wagmi";

const address = process.env.NEXT_PUBLIC_VOTING_ADDRESS as `0x${string}`;

export function Proposals() {
  const result = useReadContract({
    abi: contractJSON.abi,
    address,
    functionName: "proposalCount",
  });

  return <section>Number of proposals: {(result?.data as any) ?? 0}</section>;
}
