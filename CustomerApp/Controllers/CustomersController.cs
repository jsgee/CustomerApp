using CustomerApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CustomerApp.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly CustomersContext _customersContext;

        public CustomersController(CustomersContext customersContext) => _customersContext = customersContext;

        [HttpGet]
        public async Task<ActionResult> GetCustomers()
        {
            try
            {
                return _customersContext.Customers != null && _customersContext.Customers.Any() ? Ok(await _customersContext.Customers.OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ToListAsync())
              : NoContent();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error retrieving data from the database");
            }
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Customer>> GetCustomer(int id)
        {
            try
            {
                var result = await _customersContext.Customers.SingleOrDefaultAsync(x => x.Id == id);

                if (result == null)
                    return NotFound();

                return Ok(result);
            }

            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                 "Error retrieving data from the database");
            }
        }



        [HttpPost]
        public async Task<ActionResult<Customer>> CreateCustomer([FromBody] Customer customer)
        {

            int customerId = 0;
            try
            {
                if (customer == null)
                    return BadRequest();

                if (_customersContext.Customers.Any(c => c.Email.ToLowerInvariant() == customer.Email.ToLowerInvariant()))
                {
                    ModelState.AddModelError("email", "Customer email already exists.");
                    return BadRequest(ModelState);
                }

                await _customersContext.Customers.AddAsync(customer);
                customerId = await _customersContext.SaveChangesAsync();

                var newCustomer = await _customersContext.Customers.SingleOrDefaultAsync(x => x.Id == customerId);

                return CreatedAtAction(nameof(GetCustomer), new { id = customerId }, newCustomer);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Error creating customer.");
            }
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Customer>> UpdateCustomer(int id, Customer customer)
        {
            try
            {
                if (id != customer.Id)
                    return BadRequest("Customer ID mismatch");

                var customerToUpdate = await _customersContext.Customers.SingleOrDefaultAsync(c => c.Id == id);

                if (customerToUpdate == null)
                    return NotFound($"Customer with Id = {id} not found");

                _customersContext.Customers.Update(customer);
                await _customersContext.SaveChangesAsync();

                return Ok();
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                    "Error updating customer");
            }
        }
    }
}
