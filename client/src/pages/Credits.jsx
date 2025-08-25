
import { useEffect, useState } from 'react'
import { dummyPlans } from '../assets/assets'
import Loading from '../pages/Loading'
import { useAppContect } from '../context/AppContext'
import { FaWindowRestore } from 'react-icons/fa'
import toast from 'react-hot-toast'

const Credits = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(false)
  const {axios,token} = useAppContect()
  const fetchPlans = async () => {
   try {
    const {data} = await axios.get('/api/credit/plan',{
      headers:{Authorization:token}
    })
    if(data.success){
      setPlans(data.plans)
    }else{
      toast.error(data.message || "failed to fetch plans")
    }
   } catch (error) {
    toast.error(error.message)
    
   }
   setLoading(false)
  }

  const purchasePlan = async(planId)=>{
    try {
      const {data} = await axios.post('/api/credit/purchase',{planId},{headers:{Authorization:token}})
      if(data.success){
        window.location.href = data.url
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      
    }

  }

  useEffect(() => {
    fetchPlans()
  }, [])

  if (loading) return <Loading />

  return (
    <div className='max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-12'>
      <h2 className='text-4xl font-bold text-center mb-12 text-gray-800 dark:text-white'>
        Credit Plans
      </h2>

      <div className='flex flex-wrap justify-center gap-10'>
        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`w-full sm:w-80 border border-gray-200 dark:border-purple-700 rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-2 p-8 flex flex-col text-center ${plan._id === 'pro'
                ? 'bg-purple-50 dark:bg-purple-900'
                : 'bg-white dark:bg-gray-800'
              }`}
          >
            <div className='flex-1'>
              <h3 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
                {plan.name}
              </h3>
              <p className='text-3xl font-bold text-purple-600 dark:text-purple-300 mb-4'>
                ₹{plan.price}
              </p>
              <div className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
                {plan.credits} credits
              </div>
              <ul className="text-left list-none text-base text-gray-700 dark:text-purple-200 space-y-2 leading-relaxed">
                {plan.features.map((feature, index) => (
                  <li key={index} className="relative pl-5">
                    <span className="absolute left-0 text-purple-600 dark:text-purple-400">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={()=>toast.promise(purchasePlan(plan._id),{loading:"Processing..."})} className='mt-6 bg-purple-600 hover:bg-purple-700 actice:bg-purple-800 text-white font-medium py-2 rounded transition-colors cursor-pointer'>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Credits