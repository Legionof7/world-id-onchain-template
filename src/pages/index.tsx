import { useState } from 'react'
import { BigNumber } from 'ethers'
import { decode } from '@/lib/wld'
import ContractAbi from '@/abi/Contract.abi'
import { ConnectKitButton } from 'connectkit'
import { IDKitWidget, ISuccessResult, VerificationLevel } from '@worldcoin/idkit'
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi'

export default function Home() {
	const { address } = useAccount()
	const [proof, setProof] = useState<ISuccessResult | null>(null)

	const verifyProof = async (proof: ISuccessResult) => {
		throw new Error("TODO: verify proof server route")
	  };
	  
	  // TODO: Functionality after verifying
	  const onSuccess = () => {
		console.log("Success")
	  };
	  
	const { config } = usePrepareContractWrite({
		address: process.env.NEXT_PUBLIC_CONTRACT_ADDR as `0x${string}`,
		abi: ContractAbi,
		enabled: proof != null && address != null,
		functionName: 'verifyAndExecute',
		args: [
			address!,
			proof?.merkle_root ? decode<BigNumber>('uint256', proof?.merkle_root ?? '') : BigNumber.from(0),
			proof?.nullifier_hash ? decode<BigNumber>('uint256', proof?.nullifier_hash ?? '') : BigNumber.from(0),
			proof?.proof
				? decode<[BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(
						'uint256[8]',
						proof?.proof ?? ''
				  )
				: [
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
						BigNumber.from(0),
				  ],
		],
	})

	const { write } = useContractWrite(config)

	return (
		<main>
			{address ? (
				proof ? (
					<button onClick={write}>submit tx</button>
				) : (
					<IDKitWidget
						signal={address}
						action="your-action"
						onSuccess={setProof}
						handleVerify={verifyProof}
						verification_level={VerificationLevel.Orb}
						app_id={process.env.NEXT_PUBLIC_APP_ID! as `app_${string}`}
					>
						{({ open }: { open: any }) => <button onClick={open}>verify with world id</button>}
					</IDKitWidget>
				)
			) : (
				<ConnectKitButton />
			)}
		</main>
	)
}
